package com.example.tursuapp.authentication.signup

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.LoginResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.verification.VerificationActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SignUpActivity : AppCompatActivity() {
    private lateinit var userName : EditText
    private lateinit var name : EditText
    private lateinit var surname : EditText
    private lateinit var eMail : EditText
    private lateinit var password : EditText
    private lateinit var passwordConfirmation : EditText


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        // Configure sign-in to request the user's ID, email address, and basic profile.
        // ID and basic profile are included in DEFAULT_SIGN_IN.
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.oauth_client_id))
            .requestEmail()
            .build()

        // Build a GoogleSignInClient with the options specified by gso.
        val mGoogleSignInClient = GoogleSignIn.getClient(this, gso)

        userName = findViewById(R.id.signup_username)
        name = findViewById(R.id.signup_name)
        surname = findViewById(R.id.signup_surname)
        eMail = findViewById(R.id.signup_email)
        password = findViewById(R.id.signup_password)
        passwordConfirmation = findViewById(R.id.signup_passwordConfirmation)

        findViewById<Button>(R.id.signup_button)?.apply {
            setOnClickListener {
                val firstName = name.text.toString()
                val lastName = surname.text.toString()
                val username = userName.text.toString()
                val email = eMail.text.toString()
                val password1 = password.text.toString()
                val password2 = passwordConfirmation.text.toString()

                if (username.isEmpty() || firstName.isEmpty() ||
                        lastName.isEmpty() || email.isEmpty() ||
                        password1.isEmpty() || password2.isEmpty()) {
                    Toast.makeText(applicationContext,
                            "Please complete all the fields!", Toast.LENGTH_SHORT).show()
                }
                else {
                    if (password1 != password2) {
                        Toast.makeText(applicationContext,
                                "The passwords don't match, please check your password!",
                                Toast.LENGTH_SHORT).show()
                    }
                    else {
                        val strongPasswordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}\$".toRegex()
                        if(password1.matches(strongPasswordPattern)) {
                            signUp(this, firstName, lastName, username, email, password1)
                        }
                        else {
                            Toast.makeText(applicationContext,
                                    "Your password is not strong enough! It should have minimum " +
                                            "8 characters, at least one uppercase letter, one lowercase " +
                                            "letter and one number!", Toast.LENGTH_LONG).show()
                        }

                    }
                }

            }
        }

        findViewById<Button>(R.id.google_signup_button).setOnClickListener {
            val signInIntent = mGoogleSignInClient.signInIntent
            startActivityForResult(signInIntent, 1)
        }

        findViewById<TextView>(R.id.signup_vendor_text).let { view ->
            view.setOnClickListener {
                startActivity(Intent(this, VendorSignupActivity::class.java))
            }
        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == 1) {
            // The Task returned from this call is always completed, no need to attach a listener.
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val task = completedTask.getResult(ApiException::class.java)

            // Signed in successfully, show authenticated UI.
            googleSignup(task.idToken.toString())

        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w("Google sign up error", "signInResult:failed code=" + e.statusCode)
            Toast.makeText(applicationContext, "Could not register, please try again later!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun signUp(button: Button, first_name: String, last_name: String, username: String,
                       email: String, password: String){
        button.isClickable = false
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<Void> = apiInterface.signup(first_name, last_name, username, email, password)

        Log.i("SignupRequest", call.request().toString())

        call.enqueue(object : Callback<Void?> {
            override fun onResponse(call: Call<Void?>, response: Response<Void?>) {
                val userResponse: Void? = response.body()
                Log.i("SignupResponseStatus", response.code().toString())
                button.isClickable = true

                if (userResponse == null) {
                    Toast.makeText(applicationContext, "Signup successful, please verify your email now!", Toast.LENGTH_LONG).show()
                    val intent = Intent(applicationContext, VerificationActivity::class.java)
                    intent.putExtra("email", email)
                    intent.putExtra("password", password)
                    Log.i("SignupIntent", intent.extras.toString())
                    startActivity(intent)
                } else {
                    Log.e("SignupError",response.toString())
                    Toast.makeText(applicationContext, "Could not sign up, there was an error!", Toast.LENGTH_SHORT).show()
                }

            }

            override fun onFailure(call: Call<Void?>, t: Throwable) {
                button.isClickable = true
                Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun googleSignup(id_token: String){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<LoginResponse> = apiInterface.googleSignup(id_token, is_vendor="")

        Log.w("token", id_token)
        Log.w("request", call.request().toString())

        call.enqueue(object : Callback<LoginResponse?> {
            override fun onResponse(
                call: Call<LoginResponse?>,
                response: Response<LoginResponse?>
            ) {
                val userResponse: LoginResponse? = response.body()
                Log.i("Status code", response.code().toString())
                Log.i("Response", response.toString())

                if (userResponse != null) {
                    val pref = applicationContext.getSharedPreferences("UserPref", 0)
                    with(pref.edit()) {
                        putString("first_name", userResponse.first_name)
                        putString("last_name", userResponse.last_name)
                        putString("user_type", userResponse.user_type)
                        putString("auth_token", "Token " + userResponse.auth_token)
                        putBoolean("logged_in", true)
                        apply()
                    }

                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                    finish()

                } else {
                    Toast.makeText(applicationContext, "Could not sign up, there was an error!", Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<LoginResponse?>, t: Throwable) {
                Toast.makeText(applicationContext, "Could not sign up, there was an error!", Toast.LENGTH_SHORT).show()
            }

        })
    }

}