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
import com.example.tursuapp.adapter.ShoppingCartAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ShoppingCartProductResponse
import com.example.tursuapp.authentication.homepage.ui.shoppingcart.ShoppingCartFragment
import com.google.android.material.textfield.TextInputEditText
import com.squareup.picasso.Picasso
import retrofit2.Call
import retrofit2.Response
import java.lang.Exception


class PaymentFragment : Fragment() {

    private lateinit var paymentViewModel: PaymentModel
    private lateinit var product: ProductDetailsResponse
    val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        paymentViewModel = ViewModelProvider(this).get(PaymentModel::class.java)
        val root = inflater.inflate(R.layout.fragment_paymentpage, container, false)

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        shoppingCartAllProducts(auth_token,view)
        view.findViewById<Button>(R.id.confirmandpay).setOnClickListener() {

            if (view.findViewById<TextInputEditText>(R.id.nameinputtext).text.toString() == "") {
                Toast.makeText(context, "Lütfen geçerli bir isim giriniz.", Toast.LENGTH_SHORT).show()
            } else if (view.findViewById<TextInputEditText>(R.id.cardnumberinputtext).text.toString().length != 16|| !isAllNumber((view.findViewById<TextInputEditText>(R.id.cardnumberinputtext).text.toString()))) {
                Toast.makeText(context, "Lütfen geçerli bir kart numarası giriniz.", Toast.LENGTH_SHORT).show()
            } else if (view.findViewById<TextInputEditText>(R.id.cvcinputtext).text.toString().length != 3 || !isAllNumber(view.findViewById<TextInputEditText>(R.id.cvcinputtext).text.toString())) {
                Toast.makeText(context, "Lütfen geçerli bir CVC numarası giriniz.", Toast.LENGTH_SHORT).show()
            } else if (view.findViewById<TextInputEditText>(R.id.expirationdateinputtext).text.toString()==""||view.findViewById<TextInputEditText>(R.id.expirationdateinputtext).text.toString().length != 5 ||!isLegidDate(view.findViewById<TextInputEditText>(R.id.expirationdateinputtext).text.toString())) {
                Toast.makeText(context, "Lütfen geçerli bir tarih giriniz.", Toast.LENGTH_SHORT).show()
            } else if (view.findViewById<TextInputEditText>(R.id.addressinputtext).text.toString() == "") {
                Toast.makeText(context, "Lütfen geçerli bir adres giriniz.", Toast.LENGTH_SHORT).show()
            } else if (view.findViewById<TextInputEditText>(R.id.cityinputtext).text.toString() == "") {
                Toast.makeText(context, "Lütfen geçerli bir şehir giriniz.", Toast.LENGTH_SHORT).show()
            } else if (!view.findViewById<CheckBox>(R.id.checkBox).isChecked) {
                Toast.makeText(context, "Lütfen koşulları kabul ediniz.", Toast.LENGTH_SHORT).show()
            } else {
                val newFragment = PaymentSuccessFragment()
                val fragmentManager: FragmentManager? = fragmentManager
                val fragmentTransaction: FragmentTransaction =
                        requireFragmentManager().beginTransaction()
                fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                fragmentTransaction.commit()
            }

    }

    }
    fun shoppingCartAllProducts(auth_token:String,view: View){
        val listView = view.findViewById<ListView>(R.id.shoppinCartItemsListView)
        var shoppinCartProducts = ArrayList<ShoppingCartProductResponse>()
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductsShoppingCart(auth_token).enqueue(object : retrofit2.Callback<List<ShoppingCartProductResponse>> {
            override fun onFailure(p0: Call<List<ShoppingCartProductResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<ShoppingCartProductResponse>>?,
                    response: Response<List<ShoppingCartProductResponse>>?
            ) {
                if (response != null) {
                    if(response.body()!=null){
                        shoppinCartProducts = ArrayList(response.body()!!)

                        val adapter = context?.let { ShoppingCartAdapter(it,shoppinCartProducts,auth_token,true,null) }
                        val price = adapter?.calculateTotalPrice()
                        listView.adapter = adapter
                        view.findViewById<TextView>(R.id.totalPrice).text = price.toString() + " TL"
                    }

                }

            }
        })
    }
    fun  giveMeDigitCount(number:Int):Int{
        var count=0
        var sayi=number
        while(sayi>0){
            sayi=sayi/10
            count++
        }
        return count
    }
    fun  isAllNumber(number:String):Boolean{
        for (item in number) {
            try{
               var x= item.toInt()
            }catch(e: Exception){
                return false;
            }

        }
        return true;
    }
    fun  isLegidDate(date:String):Boolean{
       try {
           if(date.length!=5){
               return false;
           }
           if(date.substring(0,2).toInt()>12){
               return false;
           }
           if(!(date.substring(3,5).toInt()<99)){
               return false;
           }
           return true;
       }catch (e:Exception){
           return false;
       }

    }
}