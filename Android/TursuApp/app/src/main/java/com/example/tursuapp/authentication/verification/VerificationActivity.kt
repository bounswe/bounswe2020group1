package com.example.tursuapp.authentication.verification

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
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")
class VerificationActivity: AppCompatActivity() {

    private lateinit var verificationCode : EditText
    private lateinit var resendText: TextView
    private lateinit var verifyButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verification)

        val extras = intent.extras
        val email = extras?.getString("email")
        val password = extras?.getString("password")

        Log.i("Emaill", email)

        verificationCode = findViewById(R.id.verification_code)
        resendText = findViewById(R.id.resend_code)
        verifyButton = findViewById(R.id.verify_button)

        verifyButton.setOnClickListener {
            if (email != null && password != null) {
                verify(email, password, verificationCode.text.toString())
            }
        }

        resendText.setOnClickListener{
            if (email != null) {
                resendVerificationCode(email)
            }
        }

    }

    private fun verify(email: String, password: String, verificationCode: String) {
        verifyButton.isClickable = false
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<LoginResponse> = apiInterface.verification(email, password, verificationCode)

        Log.w("request", call.request().toString())

        call.enqueue(object : Callback<LoginResponse?> {
            override fun onResponse(call: Call<LoginResponse?>, response: Response<LoginResponse?>) {
                val userResponse: LoginResponse? = response.body()
                Log.i("Status code", response.code().toString())
                verifyButton.isClickable = true

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
                        Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse?>, t: Throwable) {
                verifyButton.isClickable = true
                Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
                Log.i("Failure", t.message)
            }
        })
    }

    private fun resendVerificationCode(email: String) {
        resendText.isClickable = false
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<Void> = apiInterface.verificationResend(email)

        Log.w("request", call.request().toString())

        call.enqueue(object: Callback<Void?> {
            override fun onResponse(call: Call<Void?>, response: Response<Void?>) {
                val userResponse: Void? = response.body()
                resendText.isClickable = true

                        if (userResponse == null) {
                    Toast.makeText(applicationContext, "Code resent, check your email!", Toast.LENGTH_SHORT).show()

                } else {
                    Toast.makeText(applicationContext, "Could not resend code, there was an error!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void?>, t: Throwable) {
                resendText.isClickable = true
                Toast.makeText(applicationContext, "Could not resend code, there was an error!", Toast.LENGTH_SHORT).show()
            }

        })
    }

}