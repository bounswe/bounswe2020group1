package com.example.tursuapp.authentication.login
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.MainActivity
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RequestService
import com.example.tursuapp.api.requests.LoginRequest
import com.example.tursuapp.api.responses.TokenResponse
import com.example.tursuapp.authentication.AuthenticationValidator
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.signup.SignUpActivity
import io.reactivex.disposables.CompositeDisposable
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.example.tursuapp.api.RetrofitClient


class LoginActivity : AppCompatActivity() {
    private lateinit var email : EditText
    private lateinit var password: EditText
    private lateinit var requestService : RequestService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        email = findViewById(R.id.login_email)
        password = findViewById(R.id.login_password)

        requestService = ApiService.getInstance()

        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<TextView>(R.id.forgot_password_button).setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }
        findViewById<Button>(R.id.sign_in_button).setOnClickListener {
            startActivity(Intent(this, HomePageActivity::class.java))
        }

        findViewById<Button>(R.id.login_button).apply {
            this.setOnClickListener {
                login(this)
            }
        }

    }

    private fun login(button: Button){


        when{
            !AuthenticationValidator.validateEmail(email = email.text.toString()) ->
                Toast.makeText(getApplicationContext(),"Invalid Email!",Toast.LENGTH_SHORT).show()
        }

        val userInfo = LoginRequest(email = email.text.toString(),
                                    password = password.text.toString())

        requestService.login(userInfo).enqueue(
                object: Callback<TokenResponse>{
                    override fun onResponse(call: Call<TokenResponse>, response: Response<TokenResponse>) {
                        if (response.code()==200){
                            startActivity(
                                    Intent(
                                            this@LoginActivity,
                                            MainActivity::class.java
                                    )
                            )
                        }
                        else{
                            Toast.makeText(getApplicationContext(),"Status Code == " + response.code().toString(),Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onFailure(call: Call<TokenResponse>, t: Throwable) {
                        Toast.makeText(getApplicationContext(),t.message.toString(),Toast.LENGTH_SHORT).show()

                    }
                }
        )


    }

}