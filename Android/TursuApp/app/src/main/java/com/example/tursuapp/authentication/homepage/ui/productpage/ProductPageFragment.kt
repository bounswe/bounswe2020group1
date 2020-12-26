package com.example.tursuapp.authentication.homepage.ui.productpage

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.OrderAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.*
import com.squareup.picasso.Picasso
import com.example.tursuapp.authentication.homepage.ui.shoppingcart.ShoppingCartFragment
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: ProductPageModel
    private lateinit var product: ProductDetailsResponse
    private lateinit var AddListStatus: AddListResponse
    val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"
    var allLists = listOf<String>()
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {



        activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        activity?.findViewById<EditText>(R.id.editMobileNo)!!.visibility = View.INVISIBLE
        activity?.findViewById<Button>(R.id.search_button)!!.visibility = View.INVISIBLE
        productPageViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productpage, container, false)
        root.findViewById<ImageView>(R.id.add_list_image)?.setOnClickListener {
            showPopupWindow(it)
        }
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        getDetails(id_str!!.toInt(), view)
        view.findViewById<CardView>(R.id.addCart).setOnClickListener(){
            var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            val quantity = 1
            apiinterface.addToShoppingCart(auth_token,product.id).enqueue(object :
                    retrofit2.Callback<ResponseBody> {
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
                        }
                         else{
                            Toast.makeText(context,"NOT added to shopping cart",Toast.LENGTH_SHORT).show()
                        }
                    }

                }


            })
        }

    }

    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.lists_popup_layout, null)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //val width = LinearLayout.LayoutParams.WRAP_CONTENT
        //val height = LinearLayout.LayoutParams.WRAP_CONTENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
        getLists(popupView)
        popupView.findViewById<ImageView>(R.id.dismiss_popup2).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.add_new_List_button).setOnClickListener {
            addList(popupView)
            popupWindow.dismiss()
            showPopupWindow(popupView)
        }
        popupView.findViewById<Button>(R.id.add_product_to_list).setOnClickListener {
            addToList(popupView)
            //popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.delete_List_button).setOnClickListener {
            deleteList(popupView)
            popupWindow.dismiss()
            showPopupWindow(popupView)
        }
        popupView.findViewById<Button>(R.id.delete_product_from_list).setOnClickListener {
            deleteFromList(popupView)
            //popupWindow.dismiss()
        }
    }

    private fun getLists(view: View){
            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getLists("token f057f527f56398e8041a1985919317a5c0cc2e77").enqueue(object :
                    retrofit2.Callback<List<String>> {
                override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                    //Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<List<String>>?,
                        response: Response<List<String>>?
                ) {
                    if (response != null) {
                        Log.i("Status code",response.code().toString())
                        allLists = response.body()!!
                        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupLists)
                        for(list in allLists){
                            Log.i("List:",list)
                            val btn1 = RadioButton(activity?.applicationContext)
                            btn1.text = list
                            radioGroup.addView(btn1)
                        }


                    }


                }

            })

    }

    private fun addList(view: View){
        if(view.findViewById<EditText>(R.id.new_list_txt).text.isNotEmpty()){
            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val empty=""
            val listName = view.findViewById<EditText>(R.id.new_list_txt).text.toString()
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addList("token f057f527f56398e8041a1985919317a5c0cc2e77",listName).enqueue(object :
                    retrofit2.Callback<AddListResponse> {
                override fun onFailure(p0: Call<AddListResponse>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<AddListResponse>?,
                        response: Response<AddListResponse>?
                ) {

                    if (response != null) {
                        Toast.makeText(context, "Success", Toast.LENGTH_SHORT).show()
                        showPopupWindow(view)
                       // Log.i("Status code",response.code().toString())
                       // AddListStatus = response.body()!!
                        //view.findViewById<EditText>(R.id.new_list_txt).setText("")

                    }

                }


            })

        }

        /*
        if(type==2){
            search(keys)
        }
        else if(type==1){
            displayCategory(keys)
        }
        Log.i("FilterActivity",filters.toString())

         */
    }
    private fun addToList(view: View){
        val selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
        Log.i("Selected List Id: ",selectedList.toString())
        val newRadioButton = view.findViewById<RadioButton>(selectedList)
        Log.i("Selected List Name: ",newRadioButton.text.toString())
        val listName=newRadioButton.text.toString()
        val productId=product.id
        Log.i("Product Id: ",productId.toString())

        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.addToList("token f057f527f56398e8041a1985919317a5c0cc2e77",listName,productId).enqueue(object :
                retrofit2.Callback<AddToListResponse> {
            override fun onFailure(p0: Call<AddToListResponse>?, p1: Throwable?) {
                 Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<AddToListResponse>?,
                    response: Response<AddToListResponse>?
            ) {
                if (response != null) {
                    Toast.makeText(activity?.applicationContext, "Success", Toast.LENGTH_SHORT).show()
                    //showPopupWindow(view)
                     Log.i("Status code",response.code().toString())
                    // AddListStatus = response.body()!!
                    //view.findViewById<EditText>(R.id.new_list_txt).setText("")

                }

            }


        })

    }

    private fun deleteList(view: View){
        var selectedList=-1
        selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
        if(selectedList!=-1) {
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()

            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteList("token f057f527f56398e8041a1985919317a5c0cc2e77", listName).enqueue(object :
                    retrofit2.Callback<DeleteListResponse> {
                override fun onFailure(p0: Call<DeleteListResponse>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<DeleteListResponse>?,
                        response: Response<DeleteListResponse>?
                ) {

                    if (response != null) {
                        Toast.makeText(activity?.applicationContext, "Success", Toast.LENGTH_SHORT).show()
                        //showPopupWindow(view)
                        Log.i("Status code", response.code().toString())
                        // AddListStatus = response.body()!!

                    }

                }

            })

        }

    }

    private fun deleteFromList(view: View){
        val selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
        Log.i("Selected List Id: ",selectedList.toString())
        val newRadioButton = view.findViewById<RadioButton>(selectedList)
        Log.i("Selected List Name: ",newRadioButton.text.toString())
        val listName=newRadioButton.text.toString()
        val productId=product.id
        Log.i("Product Id: ",productId.toString())

        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.deleteFromList("token f057f527f56398e8041a1985919317a5c0cc2e77",listName,productId).enqueue(object :
                retrofit2.Callback<DeleteFromListResponse> {
            override fun onFailure(p0: Call<DeleteFromListResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<DeleteFromListResponse>?,
                    response: Response<DeleteFromListResponse>?
            ) {
                if (response != null) {
                    Toast.makeText(activity?.applicationContext, "Success", Toast.LENGTH_SHORT).show()
                    //showPopupWindow(view)
                    Log.i("Status code",response.code().toString())
                    // AddListStatus = response.body()!!
                    //view.findViewById<EditText>(R.id.new_list_txt).setText("")

                }

            }


        })

    }

    fun getDetails(id: Int, view: View){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductDetails(id).enqueue(object :
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
        if(product.photo_url!="") {
            Picasso
                .get() // give it the context
                .load(product.photo_url) // load the image
                .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
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