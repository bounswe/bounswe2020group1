package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ShoppingCartProductResponse
import com.squareup.picasso.Picasso
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response
import java.math.RoundingMode
import java.text.DecimalFormat

class ShoppingCartAdapter(context: Context, private var shoppingCartProducts: ArrayList<ShoppingCartProductResponse>,auth_token:String,isPayment:Boolean,priceView:TextView?) : BaseAdapter() {
    var context: Context? = context
    val auth_token = auth_token
    var isPayment = isPayment
    val priceView = priceView

    override fun getCount(): Int {
        return shoppingCartProducts.size
    }

    override fun getItem(position: Int): Any {
        return shoppingCartProducts[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        //val food = this.productList[position]

        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val productView = inflator.inflate(R.layout.product_for_shopping_cart, null)
        if(isPayment){
            productView.findViewById<LinearLayout>(R.id.changeQuantityLayout).visibility = View.INVISIBLE
        }
        else{
            productView.findViewById<ImageView>(R.id.increase).setOnClickListener {
                val quantityView = productView.findViewById<TextView>(R.id.shoppingCartProductQuantity)
                increaseQuantity(shoppingCartProducts[position].product.id,quantityView)
                shoppingCartProducts[position].quantity = shoppingCartProducts[position].quantity+1
                if (priceView != null) {
                    priceView.text = calculateTotalPrice().toString()+" TL"
                }
            }
            productView.findViewById<ImageView>(R.id.decrease).setOnClickListener {
                val quantityView = productView.findViewById<TextView>(R.id.shoppingCartProductQuantity)
                decreaseQuantity(shoppingCartProducts[position].product.id,quantityView)
                shoppingCartProducts[position].quantity = shoppingCartProducts[position].quantity-1
                if (priceView != null) {
                    priceView.text = calculateTotalPrice().toString()+" TL"
                }
            }
        }
        //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
        productView.findViewById<TextView>(R.id.ProductName).text = shoppingCartProducts[position].product.name
        productView.findViewById<TextView>(R.id.shoppingcartProductPrice).text = shoppingCartProducts[position].product.price + " TL"
        productView.findViewById<TextView>(R.id.shoppingCartProductQuantity).text = shoppingCartProducts[position].quantity.toString()
        val image  = productView.findViewById<ImageView>(R.id.shoppingcartProductImage)
        if(shoppingCartProducts[position].product.photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(shoppingCartProducts[position].product.photo_url) // load the image
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }

        return productView
    }



    fun increaseQuantity(productID:Int,quantityView:TextView){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.addToShoppingCart(auth_token,productID).enqueue(object : retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
            ) {
                if (response != null) {
                    if(response.code()==200){
                        Toast.makeText(context,"added to shopping cart",Toast.LENGTH_SHORT).show()
                        quantityView.text = (quantityView.text.toString().toInt()+1).toString()
                    }
                    else{
                        Toast.makeText(context,"NOT added to shopping cart",Toast.LENGTH_SHORT).show()
                    }

                }

            }
        })
    }
    fun decreaseQuantity(productID:Int,quantityView: TextView){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.removeFromShoppingCart(auth_token,productID).enqueue(object : retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
            ) {
                if (response != null) {
                    if(response.code()==200){
                        Toast.makeText(context,"removed from shopping cart",Toast.LENGTH_SHORT).show()
                        quantityView.text = (quantityView.text.toString().toInt()-1).toString()
                    }
                    else{
                        Toast.makeText(context,"NOT removed shopping cart",Toast.LENGTH_SHORT).show()
                    }

                }

            }
        })
    }
    fun calculateTotalPrice():String{
        var total = 0.0
        for(item in shoppingCartProducts){
            total += ((item.product.price.toDouble()) * (item.quantity))
        }
        val df = DecimalFormat("#.#")
        df.roundingMode = RoundingMode.CEILING
        val res = df.format(total)
        return res
    }
}