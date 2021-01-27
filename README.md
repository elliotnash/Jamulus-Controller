need to add <code>%jamulus ALL= NOPASSWD: /bin/systemctl kill -s *</code>
to sudoers to allow user jamulus to send SIGUSR2 signals to the jamulus app

nodejs server must run as jamulus user

jamulus user must have read write perms to recording directory, should probably create home directory for user jamulus and put it there
