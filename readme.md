need to add <code>%jamulus ALL= NOPASSWD: /bin/systemctl kill -s *</code>
to sudoers to allow user jamulus to send signals to the jamulus app

nodejs server must run as jamulus user