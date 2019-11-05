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

my $hours_b4_start=-4;
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
  return (undef,undef);
}

my $cgi = CGI->new();
my $state_dir ="/opt/local/www/apache2/miniQ";
my $state_init_file= sprintf("%s/%s", $state_dir, "az_init_run");
my ($date_range, $init) = get_current_date($state_init_file);
#print STDERR Dumper($init);
#my $state_file= sprintf("%s/%s_2", $state_dir, strftime( "%Y%m%d", localtime));
my $state_file= sprintf("%s/%s", $state_dir, $date_range);
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
  $state = encode_json($init);
  open ( my $state_fh, ">", $state_file) || die "Can't open $state_file:$!";
  print $state_fh $state;
  close($state_fh);
  #print STDERR  Dumper($state);



} else {
  $state = load_file($state_file);
}

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
print($state);
