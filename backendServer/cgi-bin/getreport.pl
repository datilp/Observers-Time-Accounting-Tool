#!/opt/local/bin/perl

use CGI          qw( );
use POSIX        qw(strftime);
use Data::Dumper qw( Dumper );
use DateTime qw();
use DateTime::TimeZone;
use File::Copy qw(copy);
use JSON;


sub load_file {
  my $state_file = shift;
  my $state="";
  {
    local $/; #slurp mode doesn't break by line
    open ( my $state_fh, "<", $state_file) || die "Can't open $state_file:$!";
    $state = <$state_fh>;
    close $fh;
  }
  return $state;
}

sub load_night {
  my $current_night = shift;
  my $state_dir ="/opt/local/www/apache2/miniQ";
  $state_file= sprintf("%s/%s", $state_dir, $current_night);
  return load_file($state_file);
}

sub calc_totals {
  my $currentNight = shift;
  my $state_dir ="/opt/local/www/apache2/miniQ";
  my $state_init_file= sprintf("%s/%s", $state_dir, "az_init_run");
  $init_state_str = load_file($state_init_file);
  my $VAR1;
  eval $init_state_str;
  #$init = decode_json($state_str);
  # find list of night to calculate totals
  my @night_list = sort(keys(%{$VAR1->{'nights'}->{'nights'}}));
  my @prog_list = @{$VAR1->{'programs'}->{'programs'}->{'list'}};
  my %prog_alloc = ();
  map {
    $prog_alloc{$_->{'id'}} = $_->{'alloc'};
  } @prog_list;
  my @idx = grep { $night_list[$_] eq $currentNight} ( 0 .. $#night_list);
  my @night_list = splice(@night_list, 0, $idx[0]+1);

  my %totals = ();
  for my $night (@night_list) {
    #load night
    my $state_str = load_night($night);
    #print "Night:$night\n";
    #print $state_str,"\n";
    my $state = decode_json($state_str);
    my %bins= (%{$state->{'downtime'}->{'downtime'}->{'bins'}}, %{$state->{'programs'}->{'programs'}->{'bins'}});
    my ($nightly_data, $_totals) = calc_nightly(\%bins);
    for my $bin (keys %{$_totals}) {
      $totals{$bin} =0 if (!defined $totals{$bin});
      $totals{$bin}+=$_totals->{$bin};
    }
  }

  my %ret_totals = ();
  map {
    if (defined $prog_alloc{$_}) {
      $ret_totals{$_}=[$totals{$_}, $prog_alloc{$_}];
    } else {
      $ret_totals{$_}=[$totals{$_}, undef];
    }
  } keys(%totals);

  #return \%totals;
  return (\%totals, \%ret_totals, \%prog_alloc);
}

sub calc_nightly {
  my $_bins = shift;
  my %bins = %{$_bins};
  my @nightly_data = ();
  my %totals = ();
  my $tz_name="America/Phoenix";
  for my $bin (keys %bins) {
    #print Dumper($bins{$bin});
    if (defined($bins{$bin}->{'interval'})) {
      for my $elem (@{$bins{$bin}->{'interval'}}) {
        if ( defined ($elem->{'starttime'}) &&
             defined ($elem->{'stoptime'}) ) {
             #my ($y, $M, $d, $h, $m, $s) = "2019-10-28T23:27:00.000-0700" =~ /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
             #printf("starttime=%s; stoptime=%s\n", $elem->{'starttime'}, $elem->{'stoptime'});
          my ($y, $M, $d, $h, $m, $s) = $elem->{'starttime'} =~ /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
          my $starttime = DateTime->new(
            year => $y,
            month => $M,
            day   => $d,
            hour  => $h,
            minute=> $m,
            second=> $s,
            time_zone => $tz_name); 
          ($y, $M, $d, $h, $m, $s) = $elem->{'stoptime'} =~ /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*/;
          my $stoptime = DateTime->new(
            year => $y,
            month => $M,
            day   => $d,
            hour  => $h,
            minute=> $m,
            second=> $s,
            time_zone => $tz_name); 
         
          my $diff = $stoptime->epoch - $starttime->epoch;
          $totals{$bin} =0 if (!defined $totals{$bin});
          $totals{$bin}+=$diff;
          push @nightly_data, [$bin, 
            $elem->{'starttime'}, 
            $elem->{'stoptime'}];
        }
      }
    }
  }
  return (\@nightly_data, \%totals);
}


my $hours_b4_start=-2;
sub get_current_date {
  my ($state_init_file) = shift;
  $state = load_file($state_init_file);
  my $VAR1;
  eval $state;
  #'2019-11-03T17:31:31'
  my $nights=$VAR1->{'nights'}->{'nights'};
  my $now = DateTime->now;
  #$now->add(hours=>0);
  #print "now:", $now, "\n";
  for my $day (sort(keys(%{$nights}))) {
    my $datetime = $nights->{$day}->{'start'};
    #print $datetime, "\n";
    my ($y,$m,$d,$H,$M,$S) = $datetime =~/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    #print $y,"\n";
    my $dt0 = DateTime->new(
      year => $y, month=>$m, day=>$d, hour=>$H, minute=>$M, second=>$S, time_zone=>'local');
    my $dt = DateTime->new(
      year => $y, month=>$m, day=>$d, hour=>$H, minute=>$M, second=>$S, time_zone=>'local');
    $dt->add(hours=>-$hours_b4_start);
    my $diff = $dt - $now;
    my $diffh = $dt>$now? $dt->subtract_datetime_absolute($now)->seconds/(60*60): -$dt->subtract_datetime_absolute($now)->seconds/(60*60);
    if ($diffh < 0 && abs($diffh) < 24) {
      #printf("***%s [%s] and %s\n", $day, $dt0, $diffh);
      return ($day, $VAR1);
    } #else {
    #printf("%s [%s] and %s\n", $day, $dt0, $diffh);
    #}
  }
  return ((sort(keys(%{$nights})))[-1],$VAR1);
}

my $cgi = CGI->new();
my %form = $cgi->Vars;
print STDERR "Report:";
print STDERR Dumper(\%form);
my $state_file=undef; 
my $state_dir ="/opt/local/www/apache2/miniQ";
my $state_init_file= sprintf("%s/%s", $state_dir, "az_init_run");
my $current_night = "20191028-20191029";

if (defined($form{'currentNight'})) {
  $current_night = $form{'currentNight'};
  $state_file= sprintf("%s/%s", $state_dir, $current_night);
  print STDERR "Form dateRange=[", $current_night, "]\n";

} else {
  #print STDERR Dumper($init);
  $state_file= sprintf("%s/%s", $state_dir, $current_night);
}

my $state=undef;
if (!-f $state_file) {
  print STDERR "[$state_file] State file doesn't exists\n";
} else {
  $state_str = load_file($state_file);
  $state = decode_json($state_str);
}

my %bins= (%{$state->{'downtime'}->{'downtime'}->{'bins'}}, %{$state->{'programs'}->{'programs'}->{'bins'}});
my ($nightly_data, $totals) = calc_nightly(\%bins);
#my $totals = calc_totals($current_night);
my ($totals, $ret_totals, $prog_alloc) = calc_totals($current_night);

#print Dumper($nightlyData);
#print Dumper($totals);

#print($cgi->header('text/plain'));
#print($cgi->header('application/json'));
print $cgi -> header(
-type => 'application/json',
-access_control_allow_origin => '*',
-access_control_allow_headers => 'content-type,X-Requested-With',
-access_control_allow_methods => 'GET,POST,OPTIONS',
-access_control_allow_credentials => 'true',
);

print "\n";

#local $Data::Dumper::Indent   = 1;
#local $Data::Dumper::Sortkeys = 1;
#local $Data::Dumper::Useqq    = 1;
#print STDERR $state;
my $nightlyData2 = [
            ["Poor Weather", "2019-11-06T21:22:48.068", "2019-11-06T23:03:38.068"],
            ["Calibrations", "2019-11-06T18:04:48.068", "2019-11-06T18:34:01.068"],
            ["Calibrations", "2019-11-06T18:04:48.068", "2019-11-06T18:34:01.068"],
            ["Calibrations", "2019-11-06T18:04:48.068", "2019-11-06T18:34:01.068"],
            ["Calibrations", "2019-11-06T18:04:48.068", "2019-11-06T18:34:01.068"],
            ["Calibrations", "2019-11-06T18:04:48.068", "2019-11-06T18:34:01.068"],
            ["AZ-2019B-002", "2019-11-06T18:40:48.068", "2019-11-06T21:10:10.068"],
            ["AZ-2019B-002", "2019-11-06T18:40:48.068", "2019-11-06T21:10:10.068"],
            ["AZ-2019B-002", "2019-11-06T18:40:48.068", "2019-11-06T21:10:10.068"],
            ["AZ-2019B-002", "2019-11-06T18:40:48.068", "2019-11-06T21:10:10.068"],
            ["AZ-2019B-003", "2019-11-06T23:04:48.068", "2019-11-07T06:13:01.068"]
        ];

print(encode_json({'nightlyData'=>$nightly_data, 'totals'=>$totals, 'ret_totals' => $ret_totals, 'prog_alloc' => $prog_alloc}), "\n");

