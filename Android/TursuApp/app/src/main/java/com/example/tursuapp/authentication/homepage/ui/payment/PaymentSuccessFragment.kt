package com.example.tursuapp.authentication.homepage.ui.payment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.squareup.picasso.Picasso
import retrofit2.Call
import retrofit2.Response


class PaymentSuccessFragment : Fragment() {

    private lateinit var paymentSuccessViewModel: PaymentSuccessModel
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        paymentSuccessViewModel = ViewModelProvider(this).get(PaymentSuccessModel::class.java)
        val root = inflater.inflate(R.layout.paymentsuccessfragment, container, false)

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        /*  val id_str = requireArguments().getString("id")
          val spinner = view.findViewById<Spinner>(R.id.spinner)
          val items = arrayOf("Add to favorites","Favorites", "List 1", "List 2", "List 3")
          val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
          if (spinner != null) {
              spinner.adapter = adapter
          }
          getDetails(id_str!!.toInt(), view)*/
        view.findViewById<Button>(R.id.continueShoppingPaymentSuccess).setOnClickListener(){
            val newFragment = HomeFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
    }


}