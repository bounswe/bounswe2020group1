package com.example.tursuapp.authentication.homepage.ui.profile

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProfileInfoResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response

class ProfileFragment : Fragment() {

    private lateinit var galleryViewModel: ProfileViewModel
    var profileInfo = ProfileInfoResponse("","","","",0,listOf<String>(""),listOf<String>(""))
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        galleryViewModel =
                ViewModelProvider(this).get(ProfileViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_customer_profile, container, false)

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<ImageView>(R.id.back_button).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
        }
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getCustomerProfileInfo("token f057f527f56398e8041a1985919317a5c0cc2e77").enqueue(object :
                retrofit2.Callback<ProfileInfoResponse> {
            override fun onFailure(p0: Call<ProfileInfoResponse>?, p1: Throwable?) {
                //Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ProfileInfoResponse>?,
                    response: Response<ProfileInfoResponse>?
            ) {
                if (response != null) {
                    Log.i("Status code",response.code().toString())
                    profileInfo = response.body()!!
                    if(profileInfo!=null){
                        val usernameView = view.findViewById<TextView>(R.id.profileUsername)
                        usernameView.text=profileInfo.username
                        val firstNameView = view.findViewById<TextView>(R.id.firstNameView)
                        usernameView.text=profileInfo.first_name
                        val lastNameView = view.findViewById<TextView>(R.id.lastNameView)
                        usernameView.text=profileInfo.last_name
                        val emailView = view.findViewById<TextView>(R.id.emailView)
                        usernameView.text=profileInfo.email
                    }




                }


            }

        })
    }

}