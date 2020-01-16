#!/opt/local/bin/perl

use CGI          qw( );
use POSIX        qw(strftime);
use Data::Dumper qw( Dumper );
use DateTime qw();
use DateTime::TimeZone;
use File::Copy qw(copy);
use JSON;

sub save_json {
  my $state_file_temp = shift;
  my $content = shift;
  open ($state_fh, ">", $state_file_temp) || die "Can't open $state_file_temp:$!";
  #flock($state_fh, LOCK_EX) or die "Could not lock '$state_file_temp':$!";
  
  print $state_fh $content;
  
  close $state_fh;
}

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
  $state_str = load_file($state_init_file);
  my $VAR1;
  eval $state_str;
  #$init = decode_json($state_str);
  # find list of night to calculate totals
  my @night_list = sort(keys(%{$VAR1->{'nights'}->{'nights'}}));
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

  return \%totals;
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

sub getDate {
  my ($y,$M,$d,$h, $m, $s, $tz_name) = @_;
  DateTime->new(
            year => $y,
            month => $M,
            day   => $d,
            hour  => $h,
            minute=> $m,
            second=> $s,
            time_zone => $tz_name); 
}

sub read_hist {
  my $state_file=undef; 
  my $state_dir ="/opt/local/www/apache2/miniQ";
  my $state_run_file= sprintf("%s/%s", $state_dir, "miniQRun.txt");
  my $state_str = load_file($state_run_file);
  my $state = decode_json($state_str);
  my $nstate = {};
  for my $night (keys(%{$state})) {
      # print $night, "\n";
      my $n = $state->{$night};
      my $programs = { 'programs' => {
            "currentProgramID"=>undef,
            "currentInterval"=>undef,
            "list" => [
              {
                 "pi" => "Smith",
                 "id" => "AZ-2019B-147",
                 "alloc" => 40
              },
              {
                 "id" => "AZ-2019B-006",
                 "pi" => "Volk",
                 "alloc" => 5
              },
              {
                 "alloc" => 10,
                 "pi" => "Egami",
                 "id" => "AZ-2019B-027"
              },
              {
                 "alloc" => 20,
                 "pi" => "Yang",
                 "id" => "AZ-2019B-004"
              },
              {
                 "pi" => "Lindquist",
                 "id" => "AZ-2019B-023",
                 "alloc" => 5
              },
              {
                 "pi" => "McMillan",
                 "id" => "AZ-2019B-019",
                 "alloc" => 2
              }
           ],
           'bins' => {}
          }
      };
  
      my $downtime = {'downtime' => {
            'currentAction' => undef,
            'currentInterval' => undef,
            'currentBin' => undef,
            'bins' => {}
          }
      };
  
      my $pbins = $programs->{'programs'}->{'bins'};
      my $dbins = $downtime->{'downtime'}->{'bins'};
  
      $nstate->{$night} = { 'programs' => $programs,
                            'downtime' => $downtime};
  
  
      for my $bin (keys(%{$n})) {
        #      print "\t", $bin, "\n";
        my @interval = ();
        my $hash = { "interval" => \@interval };
        my $totaltime = 0;
        map {  
          #"11/2/2019 5:14:00-UT"
          my ($m,$d,$y,$H,$M,$S,$tz) = $_->[0]=~/^(\d{2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})-(.*)$/;
          my $starttime = getDate($y, $m, $d, $H, $M, $S, $tz=="0700"? "America/Phoenix": "UTC");
          my $starttimestr = sprintf("%4d-%02d-%02dT%02d:%02d:%02d.000-%s", $y,$m,$d,$H,$M,$S,$tz=="0700"? $tz:"0000");
          ($m,$d,$y,$H,$M,$S,$tz) = $_->[1]=~/^(\d{2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})-(.*)$/;
          my $stoptime = getDate($y, $m, $d, $H, $M, $S, $tz=="0700"? "America/Phoenix": "UTC");
          my $stoptimestr = sprintf("%4d-%02d-%02dT%02d:%02d:%02d.000-%s", $y,$m,$d,$H,$M,$S,$tz=="0700"? $tz:"0000");
          $totaltime += ($stoptime->epoch - $starttime->epoch)*1;
          push @interval, { 'starttime'=> $starttimestr,
                            'stoptime' => $stoptimestr  };
        } @{$n->{$bin}};
  
        $hash->{'tonightTime'} = $totaltime;
        if ($bin =~ /^AZ.*/) {
          #$pbins->{keys %{$hash}} = values %{$hash}; 
          map { 
            #print "AZ***:",$_, "\n";
            $pbins->{$bin}->{$_} = $hash->{$_};
          } keys %{$hash};
        } else {
          #$dbins->{keys %{$hash}} = values %{$hash}; 
          map {
            #          print "DT***:",$_, "\n";
            $dbins->{$bin}->{$_} = $hash->{$_};
          } keys %{$hash};
        }
        $n->{$bin} = $hash;
        #print Dumper $hash;
        ##print Dumper $n->{$bin};
        #print "Totaltime:", $totaltime, "\n";
      }
      #print Dumper $n;
      #$state->{$night} = $n;
      #$state->{$night} = {'bins'=> $n};
  }
  
  #print Dumper $state;
  #print JSON->new->pretty->encode($nstate);
  return $nstate;
}

my $cgi = CGI->new();
my %form = $cgi->Vars;
print STDERR Dumper(\%form);
my $state_file=undef; 
my $state_dir ="/opt/local/www/apache2/miniQ";
my $state_init_file= sprintf("%s/%s", $state_dir, "az_init_run");
my ($date_range, $init) = get_current_date($state_init_file);

#$form{'dateRange'} = "20191028-20191029";
#$form{'dateRange'} = "20191104-20191105";
#$form{'dateRange'} = "20191101-20191102";
#$form{'dateRange'} = "20191104-20191105";
if (defined($form{'dateRange'})) {
  $date_range = $form{'dateRange'};
  $state_file= sprintf("%s/%s", $state_dir, $date_range);
  print STDERR "Form dateRange=[", $date_range, "]\n";

} else {
  #print STDERR Dumper($init);
  #my $state_file= sprintf("%s/%s_2", $state_dir, strftime( "%Y%m%d", localtime));
  $state_file= sprintf("%s/%s", $state_dir, $date_range);
}
my $state_str;
my $state;

if (!-f $state_file) {
  print STDERR "[$state_file] State file doesn't exists\n";
  #TODO
  ## load previous state and pass running totals to new init state
  #my $old_file = load_file($prev_state); 
  #my $VAR1;
  #my $old_state = eval $old_file;
  #
  #

  copy $state_init_file, $state_file;
  #print "copy $state_init_file, $state_file\n";
  #  print STDERR "current date:", $date_range, "\n";
  $init->{'nights'}->{'current'} = $date_range;
  $state_str = encode_json($init);
  $state = $init;
  open ( my $state_fh, ">", $state_file) || die "Can't open $state_file:$!";
  print $state_fh $state_str;
  close($state_fh);
  #print STDERR  Dumper($state);



} else {
  $state_str = load_file($state_file);
  $state = decode_json($state_str);
}

##my %months = ( 
##  '10' => "OCT",
##  '11' => "NOV",
##  '12' => "DEC");
##my ($dy,$dm,$dd) = $date_range=~ /^\d+-(\d{4})(\d{2})(\d{2})/;
##my $night_key = sprintf("%02d%s%04d", $dd, $months{$dm}, $dy);
##my $hist = read_hist();

##if (defined($hist->{$night_key})) {
##  #print Dumper $hist->{$night_key};
##  #  exit 1;
##  $state->{'downtime'} = $hist->{$night_key}->{'downtime'};
##  $state->{'programs'} = $hist->{$night_key}->{'programs'};
##}

my $totals = calc_totals($date_range);
map {
  $totals->{$_} /= (60*60);
} keys(%{$totals});
#print Dumper $totals;
#exit 1;
$state->{'totals'}->{'running_totals'} = $totals;
$state->{'nights'}->{'nights'} = $init->{'nights'}->{'nights'};

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
#print(encode_json($state));
save_json( $state_dir . "/".$date_range, JSON->new->pretty->encode($state));
print JSON->new->pretty->encode($state);
