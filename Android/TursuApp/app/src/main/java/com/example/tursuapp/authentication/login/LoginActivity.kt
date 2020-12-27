package com.example.tursuapp.authentication.login

import android.content.Intent
import android.graphics.Paint
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
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.signup.SignUpActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class LoginActivity : AppCompatActivity() {
    private lateinit var email : EditText
    private lateinit var password: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Check if the user is logged in.
//        val pref = applicationContext.getSharedPreferences("UserPref", 0)
//        if (pref.getBoolean("logged_in", false)) {
//            val intent = Intent(applicationContext, HomePageActivity::class.java)
//            startActivity(intent)
//            finish()
//        }

        val continueText = findViewById<TextView>(R.id.continue_button)
        continueText.paintFlags = continueText.paintFlags or Paint.UNDERLINE_TEXT_FLAG

        email = findViewById(R.id.login_email)
        password = findViewById(R.id.login_password)

        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<TextView>(R.id.forgot_password_button).setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }

        findViewById<Button>(R.id.login_button).setOnClickListener {
            val emailString = email.text.toString()
            val passwordString = password.text.toString()

            if (emailString.isNullOrEmpty() || passwordString.isNullOrEmpty()) {
                Toast.makeText(getApplicationContext(), "Please fill both fields!", Toast.LENGTH_SHORT).show()
            }
            else {
                login()
            }

        }

        findViewById<TextView>(R.id.continue_button).setOnClickListener {
            startActivity(Intent(applicationContext, HomePageActivity::class.java))
        }

    }

    private fun login(){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<LoginResponse> = apiinterface.login(email.text.toString(),password.text.toString())

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
                        putString("auth_token", userResponse.auth_token)
                        putBoolean("logged_in", true)
                        apply()
                    }

                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                    finish()

                } else {
                    Toast.makeText(applicationContext, "Invalid credentials!", Toast.LENGTH_SHORT).show()
                }

            }

            override fun onFailure(call: Call<LoginResponse?>, t: Throwable) {
                Log.i("Failure",t.message)
            }

        })

    }

}