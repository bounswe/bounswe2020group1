package com.example.tursuapp.authentication.homepage.ui.productpage

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.authentication.homepage.ui.shoppingcart.ShoppingCartFragment
import com.squareup.picasso.Picasso
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: ProductPageModel
    private lateinit var product: ProductDetailsResponse
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        productPageViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productpage, container, false)

        /*

        val list: MutableList<String> = ArrayList()
        list.add("RANJITH")
        list.add("ARUN")
        list.add("JEESMON")
        val languages = list
*/
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        val spinner = view.findViewById<Spinner>(R.id.spinner)
        val items = arrayOf("Add to favorites","Favorites", "List 1", "List 2", "List 3")
        val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
        if (spinner != null) {
            spinner.adapter = adapter
        }
        getDetails(id_str!!.toInt(), view)
        view.findViewById<CardView>(R.id.addCart).setOnClickListener(){
            var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiinterface.addToCart("Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9",id_str!!.toInt(),1)
            /*
         var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
         var response=apiinterface.addToCart("Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9",id_str!!.toInt(),1)
        if(response.code()==200){
            Toast.makeText(context, "Ürün sepetinize eklenirken bir sorun yaşandı.", Toast.LENGTH_SHORT).show()
        }else{ Toast.makeText(context, "Ürün sepetinize eklendi", Toast.LENGTH_SHORT).show()}*/
        }

    }
    fun getDetails(id: Int, view: View){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductDetails(id).enqueue(object :
            retrofit2.Callback<ProductDetailsResponse> {
            override fun onFailure(p0: Call<ProductDetailsResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<ProductDetailsResponse>?,
                response: Response<ProductDetailsResponse>?
            ) {
                if (response != null) {
                    product = response.body()!!
                    displayProductInfo(view)
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
    }

    fun displayProductInfo(view: View){
        view.findViewById<TextView>(R.id.product_name).text = product.name
        view.findViewById<TextView>(R.id.product_description).text = product.description
        view.findViewById<RatingBar>(R.id.ratingBar).rating = product.rating.toFloat()
        view.findViewById<TextView>(R.id.price).text = product.price+" TL"
        view.findViewById<TextView>(R.id.vendor).text = "Vendor: "+product.vendor_name

        val image  = view.findViewById<ImageView>(R.id.productImage)
        Picasso
            .get() // give it the context
            .load(product.photo_url) // load the image
            .into(image)
    }
    class ProductAdapter : BaseAdapter {
        var productList = ArrayList<ProductResponse>()
        var productImages = ArrayList<ImageView>()
        var context: Context? = null

        constructor(context: Context, productList: ArrayList<ProductResponse>) : super() {
            this.context = context
            this.productList = productList
        }

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        @SuppressLint("SetTextI18n")
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            //val food = this.productList[position]

            val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val productView = inflator.inflate(R.layout.product_for_shopping_cart, null)
            //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
            productView.findViewById<TextView>(R.id.product_id).text = this.productList[position].id.toString()
            productView.findViewById<TextView>(R.id.price_product).text = this.productList[position].price + " TL"
            productView.findViewById<TextView>(R.id.text_product).text = this.productList[position].name
            val image  = productView.findViewById<ImageView>(R.id.img_product)
            Picasso
                    .get() // give it the context
                    .load(productList[position].photo_url) // load the image
                    .into(image)
            //val url = URL(productList[position].photo_url)
            //val bmp = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            //productView.findViewById<ImageView>(R.id.img_product).setImageBitmap(bmp)
            return productView
        }
    }
}