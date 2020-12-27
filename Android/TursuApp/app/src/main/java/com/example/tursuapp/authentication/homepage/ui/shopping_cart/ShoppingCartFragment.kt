package com.example.tursuapp.authentication.homepage.ui.shopping_cart

import android.annotation.SuppressLint
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
import com.example.tursuapp.adapter.ShoppingCartAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ShoppingCartProductResponse
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.payment.PaymentFragment
import retrofit2.Call
import retrofit2.Response


class ShoppingCartFragment : Fragment() {

    private lateinit var shoppingCartViewModel: ShoppingCartModel
    private val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"

    private lateinit var shoppingCartListView : ListView
    private lateinit var price:TextView
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        shoppingCartViewModel = ViewModelProvider(this).get(ShoppingCartModel::class.java)
        val root = inflater.inflate(R.layout.fragment_shopping_cart, container, false)
        shoppingCartAllProducts(auth_token)
        setButtonVisibilities()
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
       super.onViewCreated(view, savedInstanceState)
        view.findViewById<ImageView>(R.id.sc_back_button).setOnClickListener {
            val newFragment = HomeFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
        shoppingCartListView = view.findViewById<ListView>(R.id.listShoppingCart)
        price = view.findViewById(R.id.shoppingCartTotalPrice)
        view.findViewById<Button>(R.id.GoPayment)!!.visibility = View.INVISIBLE
        view.findViewById<Button>(R.id.continueShopping).setOnClickListener(){
            val newFragment = HomeFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
        view.findViewById<Button>(R.id.GoPayment).setOnClickListener(){
            val newFragment = PaymentFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
    }


    fun shoppingCartAllProducts(auth_token:String){
        var shoppinCartProducts: ArrayList<ShoppingCartProductResponse>
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductsShoppingCart(auth_token).enqueue(object : retrofit2.Callback<List<ShoppingCartProductResponse>> {
            override fun onFailure(p0: Call<List<ShoppingCartProductResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            @SuppressLint("SetTextI18n")
            override fun onResponse(
                    p0: Call<List<ShoppingCartProductResponse>>?,
                    response: Response<List<ShoppingCartProductResponse>>?
            ) {
                if (response != null) {
                    if(response.body()!=null){
                        shoppinCartProducts = ArrayList(response.body()!!)
                        if(shoppinCartProducts.size!=0){
                            view!!.findViewById<Button>(R.id.GoPayment)!!.visibility = View.VISIBLE
                            val adapter = context?.let { ShoppingCartAdapter(it,shoppinCartProducts,auth_token,false,price) }
                            shoppingCartListView.adapter = adapter
                            price.text=  adapter?.calculateTotalPrice() + " TL"
                        }

                    }

                }

            }
        })
    }

    private fun setButtonVisibilities() {
        val filterImage = activity?.findViewById<ImageView>(R.id.filter_image)
        val searchBar = activity?.findViewById<EditText>(R.id.editMobileNo)
        val searchButton = activity?.findViewById<Button>(R.id.search_button)
        //listing all products
        filterImage!!.visibility = View.INVISIBLE
        searchBar!!.visibility = View.INVISIBLE
        searchButton!!.visibility = View.INVISIBLE
    }
}
