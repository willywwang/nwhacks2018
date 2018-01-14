module.exports = {
  'facebookAuth' : {
        'clientID'      : '358344031242511', // your App ID
        'clientSecret'  : 'cea8465be13eb24a8a24067c3190c63e', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }
}
