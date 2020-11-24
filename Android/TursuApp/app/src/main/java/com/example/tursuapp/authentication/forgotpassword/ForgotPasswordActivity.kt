package com.example.tursuapp.authentication.forgotpassword

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.authentication.login.LoginActivity
import com.example.tursuapp.authentication.signup.SignUpActivity

class ForgotPasswordActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgotpassword)
        findViewById<TextView>(R.id.signup_login_text).let { view ->
            view.setOnClickListener {
                startActivity(Intent(this, LoginActivity::class.java))
            }
        }
        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }
    }
}