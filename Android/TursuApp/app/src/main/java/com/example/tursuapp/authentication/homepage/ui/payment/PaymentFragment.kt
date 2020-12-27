package com.example.tursuapp.authentication.homepage.ui.payment

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.ShoppingCartAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CreateOrderResponse
import com.example.tursuapp.api.responses.ShoppingCartProductResponse
import com.google.android.material.textfield.TextInputEditText
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response


class PaymentFragment : Fragment() {

    private lateinit var paymentViewModel: PaymentModel
    private val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        paymentViewModel = ViewModelProvider(this).get(PaymentModel::class.java)
        val root = inflater.inflate(R.layout.fragment_paymentpage, container, false)
        setButtonVisibilities()
        return root
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
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        shoppingCartAllProducts(auth_token, view)
        val nameinputtext = view.findViewById<EditText>(R.id.nameinputtext)
        nameinputtext.requestFocus()
        var imm: InputMethodManager? = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(nameinputtext, InputMethodManager.SHOW_IMPLICIT)

        val cardnumberinputtext = view.findViewById<EditText>(R.id.cardnumberinputtext)
        nameinputtext.requestFocus()
        imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(cardnumberinputtext, InputMethodManager.SHOW_IMPLICIT)

        val cvcinputtext = view.findViewById<EditText>(R.id.cvcinputtext)
        nameinputtext.requestFocus()
        imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(cvcinputtext, InputMethodManager.SHOW_IMPLICIT)

        val expirationdateinputtext = view.findViewById<EditText>(R.id.expirationdateinputtext)
        nameinputtext.requestFocus()
        imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(expirationdateinputtext, InputMethodManager.SHOW_IMPLICIT)

        val addressinputtext = view.findViewById<EditText>(R.id.addressinputtext)
        nameinputtext.requestFocus()
        imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(addressinputtext, InputMethodManager.SHOW_IMPLICIT)

        val cityinputtext = view.findViewById<EditText>(R.id.cityinputtext)
        nameinputtext.requestFocus()
        imm = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager?
        imm?.showSoftInput(cityinputtext, InputMethodManager.SHOW_IMPLICIT)


        view.findViewById<Button>(R.id.confirmandpay).setOnClickListener {

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
                createOrder()

            }

    }

    }
    fun createOrder(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.createOrders(auth_token).enqueue(object : retrofit2.Callback<CreateOrderResponse> {
            override fun onFailure(p0: Call<CreateOrderResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<CreateOrderResponse>?,
                    response: Response<CreateOrderResponse>?
            ) {
                if (response != null) {
                    if (response.code() == 200) {

                        if (response.body()!!.invalid != null) {
                            //ürün kalmamış
                            Toast.makeText(context, "Ürün " + response.body()!!.invalid.toString() + " is not in stock", Toast.LENGTH_LONG).show()
                        } else {
                            val newFragment = PaymentSuccessFragment()
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    requireFragmentManager().beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }

                    } else {
                        Toast.makeText(context, "Unsuccessful Payment.", Toast.LENGTH_SHORT).show()
                    }
                }

            }
        })
    }
    private fun shoppingCartAllProducts(auth_token: String, view: View){
        val listView = view.findViewById<ListView>(R.id.shoppinCartItemsListView)
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
                    if (response.body() != null) {
                        shoppinCartProducts = ArrayList(response.body()!!)

                        val adapter = context?.let { ShoppingCartAdapter(it, shoppinCartProducts, auth_token, true, null) }
                        val price = adapter?.calculateTotalPrice()
                        listView.adapter = adapter
                        view.findViewById<TextView>(R.id.totalPrice).text = price.toString() + " TL"
                    }

                }

            }
        })
    }
    fun  giveMeDigitCount(number: Int):Int{
        var count=0
        var sayi=number
        while(sayi>0){
            sayi=sayi/10
            count++
        }
        return count
    }
    fun  isAllNumber(number: String):Boolean{
        for (item in number) {
            try{
               var x= item.toInt()
            }catch (e: Exception){
                return false
            }

        }
        return true
    }
    fun  isLegidDate(date: String):Boolean{
       try {
           if(date.length!=5){
               return false
           }
           if(date.substring(0, 2).toInt()>12){
               return false
           }
           if(date.substring(3, 5).toInt() >= 99){
               return false
           }
           return true
       }catch (e: Exception){
           return false
       }

    }
}