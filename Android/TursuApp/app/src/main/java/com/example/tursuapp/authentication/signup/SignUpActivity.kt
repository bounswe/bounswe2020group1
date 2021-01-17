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
import com.example.tursuapp.api.responses.TokenResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
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
                val first_name = name.text.toString()
                val last_name = surname.text.toString()
                val username = userName.text.toString()
                val email = eMail.text.toString()
                val password1 = password.text.toString()
                val password2 = passwordConfirmation.text.toString()

                if (username.isNullOrEmpty() || first_name.isNullOrEmpty() ||
                        last_name.isNullOrEmpty() || email.isNullOrEmpty() ||
                        password1.isNullOrEmpty() || password2.isNullOrEmpty()) {
                    Toast.makeText(getApplicationContext(),
                            "Please complete all the fields!", Toast.LENGTH_SHORT).show()
                }
                else {
                    if (password1 != password2) {
                        Toast.makeText(getApplicationContext(),
                                "The passwords don't match, please check your password!",
                                Toast.LENGTH_SHORT).show()
                    }
                    else {
                        signUp(this, first_name, last_name, username, email, password1)
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
                startActivity(Intent(this, VendorSignUpActivity::class.java))
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
            google_signup(task.idToken.toString(), is_vendor="")

        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w("Google sign up error", "signInResult:failed code=" + e.statusCode)
            Toast.makeText(applicationContext, "Could not register, please try again later!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun signUp(button: Button, first_name: String, last_name: String, username: String,
                       email: String, password: String){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<LoginResponse> = apiinterface.signup(first_name, last_name, username, email, password)

        Log.w("request", call.request().toString())

        call.enqueue(object : Callback<LoginResponse?> {
            override fun onResponse(call: Call<LoginResponse?>, response: Response<LoginResponse?>) {
                val userResponse: LoginResponse? = response.body()
                Log.i("Status code",response.code().toString())

                if (userResponse != null) {
                    val pref = applicationContext.getSharedPreferences("UserPref", 0)
                    with (pref.edit()) {
                        putString("first_name", userResponse.first_name)
                        putString("last_name", userResponse.last_name)
                        putString("user_type", userResponse.user_type)
                        putString("auth_token", "Token "+userResponse.auth_token)
                        putBoolean("logged_in", true)
                        apply()
                    }

                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                    finish()

                } else {
                    Toast.makeText(applicationContext, "Could not sign up, there was an error!", Toast.LENGTH_SHORT).show()
                }

            }

            override fun onFailure(call: Call<LoginResponse?>, t: Throwable) {
                Log.i("Failure",t.message)
            }

        })
    }

    private fun google_signup(id_token: String, is_vendor: String){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<LoginResponse> = apiinterface.google_signup(id_token, is_vendor="")

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

                Log.i("Failure", t.message)

            }


        })
    }

}