var Home = {
    template: '<div>Home</div>'
};

var Tickets = {
    template: '<div>Tickets</div>'
};

var EmailVerify = {
    template: `

    <div class="container">

        <h1 class="title is-1">Email Verification</h1>
        <h3 class="title is-3" v-html="verify_status"></h3>

        <div v-if="failed">

            <div class="field">
                <label class="label">Re-send Email Registration Link</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="email_input" :class="['input', {'is-danger' : form_fails['email'].length}]" type="email" placeholder="Enter your email address here">
                    <span class="icon is-small is-left"><i class="ion-md-mail"></i></span>
                    <span class="icon is-small is-right" v-if="form_fails['email'].length"><i class="ion-md-warning"></i></span>
                </div>
                <p class="help is-danger" v-if="form_fails['email'].length" v-html="form_fails['email']"></p>
                <p class="help is-success" v-if="resend_success">Verification email resent. Please check your inbox.</p>
            </div>

            <div v-if="!loading" class="field is-grouped">
                <div class="control">
                    <button @click="resend_email" class="button is-link">Send</button>
                </div>
            </div>

        </div>

    </div>

    `,
    data : function() {
        return {
            verify_status : 'Verifying...',
            fail_message : 'Failed.',
            success_message : 'Success!',
            failed : false,
            success : false,
            form_fails : {
                'email' : ''
            },
            email_input : '',
            loading : false
        }
    },
    created : function() {

        if( typeof this.$route.params.token === 'undefined' ) {
            this.verify_status = this.fail_message;
            this.failed = true;
        } else {
            axios.post('/api/email_verify/', {
                token: this.$route.params.token
            })
            .then(function (response) {

                if(response.data.status == 'success') {
                    this.verify_status = this.success_message;
                } else if(response.data.data.fail_status == 'already_verified') {
                    this.verify_status = "Email address already verified.";
                } else {
                    this.verify_status = this.fail_message;
                    this.failed = true;
                }

            }.bind(this))
            .catch(function (error) {
                this.verify_status = this.fail_message;
                this.failed = true;
            }.bind(this));
        }
    },
    methods : {
        resend_email: function() {

            this.resend_success = false;
            this.loading = true;

            axios.post('/api/resend_email_verify/', {
                email: this.email_input
            })
            .then(function (response) {

                if(response.data.status == 'success') {
                    this.resend_success = true;
                    this.form_fails['email'] = '';
                } else {
                    this.form_fails['email'] = response.data.message;
                }

                this.loading = false;

            }.bind(this))
            .catch(function (error) {

                this.form_fails['email'] = response.data.message;
                this.loading = false;

            }.bind(this));
        }
    }
};

var EditTeam = {
    template : `

    <div class="container">

        <h1 class="title is-1">Create Team</h1>

        <div v-if="!success">



        </div>

    </div>

    `,
    data : function() {
        return {
            failed : false,
            success : false,
            form_fails : {
                'missing' : [],
                'taken' : [],
                'failed_validation' : []
            },
            loading : false,
            name: '',
            url: '', // must be unique basename
            fail_default_message : 'Please check form input for any needed corrections and try again.',
            fail_message : ''
        }
    },
    created : function() {

        this.fail_message = this.fail_default_message;
    },
    methods : {
        form_fails_reset: function() {
            this.form_fails = {
                'missing' : [],
                'taken' : [],
                'failed_validation' : []
            }
        },
    }
};

var Register = {
    template: `
    <div class="container">

        <h1 class="title is-1">Register</h1>

        <div v-if="!success">

            <div class="field">
                <label class="label">Name</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="name" :class="['input', {'is-danger' : form_fails['missing'].indexOf('name') > -1 }]" type="text" placeholder="Name">
                    <span class="icon is-small is-left"><i class="ion-md-person"></i></span>
                </div>
                <p v-if="form_fails['missing'].indexOf('name') > -1" class="help is-danger">Name required.</p>
                <p v-if="form_fails['failed_validation'].indexOf('name') > -1" class="help is-danger">Name too short or long.</p>
            </div>

            <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="email" :class="['input', {'is-danger' : form_fails['missing'].indexOf('email') > -1 || form_fails['taken'].indexOf('email') > -1 }]" type="email" placeholder="Your email address">
                    <span class="icon is-small is-left"><i class="ion-md-mail"></i></span>
                </div>
                <p v-if="form_fails['missing'].indexOf('email') > -1" class="help is-danger">Email required.</p>
                <p v-if="form_fails['failed_validation'].indexOf('email') > -1" class="help is-danger">Not a valid email address.</p>
                <p v-if="form_fails['taken'].indexOf('email') > -1" class="help is-danger">Email already taken. Please choose another.</p>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="password" :class="['input', {'is-danger' : form_fails['missing'].indexOf('password') > -1 }]" type="password" placeholder="Please choose a password">
                    <span class="icon is-small is-left"><i class="ion-md-lock"></i></span>
                </div>
                <p v-if="form_fails['missing'].indexOf('password') > -1" class="help is-danger">Password required.</p>
                <p v-if="form_fails['failed_validation'].indexOf('password') > -1" class="help is-danger">Password must be at least 8 characters long, with at least one number and one letter.</p>
            </div>

            <div class="field">
                <label class="label">Password Confirm</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="password_confirm" :class="['input', {'is-danger' : password != password_confirm }]" type="password" placeholder="Please enter password again" value="">
                    <span class="icon is-small is-left"><i class="ion-md-lock"></i></span>
                </div>
                <p v-if="password != password_confirm" class="help is-danger">Passwords must match.</p>
            </div>

            <div v-if="!loading" class="field is-grouped">
                <div class="control">
                    <button @click="submit_registration" class="button is-link" :disabled="password != password_confirm">Register</button>
                </div>
            </div>

        </div>

        <p class="is-success" v-if="success">Successfully registered! Please check your email for a link to activate your account.</p>
        <p class="is-danger" v-if="failed" v-html="fail_message"></p>
    </div>
    `,
    data : function() {
        return {
            failed : false,
            success : false,
            form_fails : {
                'missing' : [],
                'taken' : [],
                'failed_validation' : []
            },
            loading : false,
            password: '',
            password_confirm: '',
            name: '',
            email: '',
            fail_default_message : 'Please check form input for any needed corrections and try again.',
            fail_message : ''
        }
    },
    created : function() {

        this.fail_message = this.fail_default_message;
    },
    methods : {
        form_fails_reset: function() {
            this.form_fails = {
                'missing' : [],
                'taken' : [],
                'failed_validation' : []
            }
        },
        submit_registration: function() {

            this.loading = true;
            this.failed = false;
            this.success = false;

            this.form_fails_reset();

            axios.post('/api/register/', {
                name: this.name,
                email: this.email,
                password: this.password
            })
            .then(function (response) {

                if(response.data.status == 'success') {
                    this.success = true;
                } else {
                    this.failed = true;
                    this.fail_message = this.fail_default_message;
                    if(typeof response.data.data.missing !== 'undefined') {
                        this.form_fails['missing'] = response.data.data.missing;
                    } else if(typeof response.data.data.taken !== 'undefined') {
                        this.form_fails['taken'] = response.data.data.taken;
                    } else if(typeof response.data.data.failed_validation !== 'undefined') {
                        this.form_fails['failed_validation'] = response.data.data.failed_validation;
                    } else {
                        this.fail_message = response.data.message;
                    }
                }

                this.loading = false;

            }.bind(this))
            .catch(function (error) {
                this.fail_message = 'Unknown error. Please notify site administrator.';
                this.loading = false;
            }.bind(this));
        }
    }
};

var SignIn = {
    template: `
        <div class="container">

        <h1 class="title is-1">Sign in</h1>

            <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="email" :class="['input', {'is-danger' : has_error('email')}]" type="email" placeholder="Your email address">
                    <span class="icon is-small is-left"><i class="ion-md-mail"></i></span>
                </div>
                <p v-if="has_error('email')" v-html="errors['email']" class="help is-danger"></p>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left has-icons-right">
                    <input v-model="password" :class="['input', {'is-danger' : has_error('password') }]" type="password" placeholder="Please enter your password">
                    <span class="icon is-small is-left"><i class="ion-md-lock"></i></span>
                </div>
                <p v-if="has_error('password')" v-html="errors['password']" class="help is-danger"></p>
            </div>

            <div v-if="!loading" class="field is-grouped">
                <div class="control">
                    <button @click="submit_sign_in" class="button is-link" :disabled="email.length == 0 || password.length == 0">Sign In</button>
                </div>

                <label class="checkbox">
                    <input v-model="remember_me" type="checkbox">
                    Remember me
                </label>
            </div>

            <p class="is-success" v-if="success" v-html="success_message"></p>
            <p class="is-danger" v-if="failed" v-html="fail_message"></p>
        </div>
    `,
    data : function() {
        return {
            failed : false,
            success : false,
            loading : false,
            errors : {},
            password: '',
            email: '',
            fail_message : '',
            success_message : 'Success!',
            remember_me: false
        }
    },
    methods : {
        has_error: function(error_type) {
            if(typeof this.errors[error_type] !== 'undefined') {
                return true;
            } else {
                return false;
            }
        },
        submit_sign_in: function() {

            this.loading = true;
            this.failed = false;
            this.success = false;

            axios.post('/api/sign_in/', {
                email: this.email,
                password: this.password,
                remember_me: this.remember_me
            })
            .then(function (response) {

                if(response.data.status == 'success') {
                    this.success = true;
                    this.success_message = response.data.message;
                    this.errors = [];

                    // Save token to cookie
                    setCookie('auth_token', response.data.data.token, 365);

                } else {
                    if(typeof response.data.data.errors !== 'undefined') {
                        this.errors = response.data.data.errors;
                    } else {
                        this.errors = [];
                    }
                    this.failed = true;
                    this.fail_message = response.data.message;
                }

                this.loading = false;

            }.bind(this))
            .catch(function (error) {
                this.fail_message = 'Unknown error. Please notify site administrator.';
                this.loading = false;
                this.errors = [];
            }.bind(this));
        }
    }
};

var Teams = {
    template: `
        <div class="container">

        <h1 class="title is-1">Teams</h1>

            <p v-if="failed" v-html="fail_message"></p>

            <table class="table" v-if="!loading && !failed">
                <tbody>
                    <tr v-for="team in teams">
                        <td v-html="team['name']"></td>
                    </tr>
                </tbody>
            </table>

        </div>
    `,
    data : function() {
        return {
            loading : false,
            failed : false,
            fail_message : '',
            teams : []
        }
    },
    created : function() {

        axios.post('/api/teams/', {
            token: getCookie('auth_token')
        })
        .then(function (response) {

            if(response.data.status == 'success') {
                this.teams = response.data.data.teams;
            } else {
                this.failed = true;
                this.fail_message = response.data.message;
            }

            this.loading = false;

        }.bind(this))
        .catch(function (error) {
            this.fail_message = 'Unknown error. Please notify site administrator.';
            this.failed = true;
            this.loading = false;
        }.bind(this));
    },
    methods : {

    }
};
