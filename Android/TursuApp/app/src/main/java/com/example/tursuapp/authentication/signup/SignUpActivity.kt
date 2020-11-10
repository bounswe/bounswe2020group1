package com.example.tursuapp.authentication.signup

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.login.LoginActivity

class SignUpActivity : AppCompatActivity() {
    private lateinit var userName : EditText
    private lateinit var name : EditText
    private lateinit var surname : EditText
    private lateinit var email : EditText
    private lateinit var password : EditText
    private lateinit var passwordConfirmation : EditText


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        userName = findViewById(R.id.signup_username)
        name = findViewById(R.id.signup_name)
        surname = findViewById(R.id.signup_surname)
        email = findViewById(R.id.signup_email)
        password = findViewById(R.id.signup_password)
        passwordConfirmation = findViewById(R.id.signup_passwordConfirmation)

        findViewById<Button>(R.id.signup_button)?.apply {
            setOnClickListener {
                signUpUser(this)
            }
        }

        findViewById<TextView>(R.id.signup_login_text).let { view ->
            view.setOnClickListener {
                startActivity(Intent(this, LoginActivity::class.java))
            }
        }

        findViewById<TextView>(R.id.signup_forgotpassword_text).let { view ->
            view.setOnClickListener {
                startActivity(Intent(this, ForgotPasswordActivity::class.java))
            }
        }

    }

    private fun signUpUser(button: Button){

    }
}