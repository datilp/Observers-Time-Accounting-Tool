#!/opt/local/bin/perl

use CGI          qw( );
use POSIX        qw(strftime);
use Data::Dumper qw( Dumper );
use Fcntl ':flock';
use JSON;

my $cgi = CGI->new();
my %form;
if (defined($cgi->param('POSTDATA'))) {
  my $content = decode_json($cgi->param("POSTDATA"));
  print STDERR Dumper($content->{'downtime'}->{'downtime'}->{'currentInterval'});
  #print STDERR Dumper($content);
  my $state_dir ="/opt/local/www/apache2/miniQ";
  #my $state_file= sprintf("%s/%s", $state_dir, strftime( "%Y%m%d", localtime));
  my $state_file_temp= sprintf("%s/%s_temp", $state_dir, $content->{'nights'}->{'current'});
  my $state_file= sprintf("%s/%s", $state_dir, $content->{'nights'}->{'current'});
  my $state_fh = undef;
  open ($state_fh, ">", $state_file_temp) || die "Can't open $state_file_temp:$!";
  #flock($state_fh, LOCK_EX) or die "Could not lock '$state_file_temp':$!";
  
  print $state_fh JSON->new->pretty->encode($content);
  
  close $state_fh;
  
  rename $state_file_temp, $state_file;
}

#print STDERR  Dumper($content);

#print($cgi->header('text/plain'));
print $cgi -> header(
-type => 'text/plain',
-access_control_allow_origin => '*',
-access_control_allow_headers => 'content-type,X-Requested-With',
-access_control_allow_methods => 'GET,POST,OPTIONS',
-access_control_allow_credentials => 'true',
);


#local $Data::Dumper::Indent   = 1;
#local $Data::Dumper::Sortkeys = 1;
#local $Data::Dumper::Useqq    = 1;
#print(Dumper(\%form));
