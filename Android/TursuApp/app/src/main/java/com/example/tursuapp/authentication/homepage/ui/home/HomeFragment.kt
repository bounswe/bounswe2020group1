package com.example.tursuapp.authentication.homepage.ui.home

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.ProductAdapter
import com.example.tursuapp.adapter.VendorAdapter
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.*
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.google.android.material.button.MaterialButton
import com.google.android.material.button.MaterialButtonToggleGroup
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
Type 5 -> account
 */

@Suppress("DEPRECATION", "UNCHECKED_CAST")
class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel

    //var adapter: ProductAdapter? = null
    lateinit var auth_token:String
    var productList = ArrayList<ProductResponse>()
    var allLists = listOf<String>()
    var vendorList = ArrayList<VendorResponse>()
    private var filters: HashMap<String, String>? = null
    private var type = 0
    private var keys = ""
    private var searchType = "product"
    private lateinit var btnVendor: MaterialButton
    private lateinit var btnProduct: MaterialButton
    private lateinit var toggleGroup: MaterialButtonToggleGroup
    private val filterDictionary = mapOf("Bestsellers" to "bestseller", "Newest" to "newest", "Ascending Price" to "priceAsc", "Descending Price" to "priceDesc", "Number of Comments" to "numComments")
    var vendorProductList = ArrayList<VendorProductLists>()
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        setFilterFunction()
        homeViewModel = ViewModelProvider(this).get(HomeViewModel::class.java)
        val args = arguments
        filters = hashMapOf()
        if (args != null) {
            type = args.getInt("type")
            setButtonVisibilities(type)
            if (type != 0) {
                keys = args.getString("keys").toString()
            }
        } else {
            //if args is null (firstly opening main screen), then filter image is invisible
            activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        }
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val textView: TextView = root.findViewById(R.id.text_home)
        homeViewModel.text.observe(viewLifecycleOwner, {
            textView.text = it
        })
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        return root
    }

    private fun setButtonVisibilities(type: Int) {
        val filterImage = activity?.findViewById<ImageView>(R.id.filter_image)
        val searchBar = activity?.findViewById<EditText>(R.id.editMobileNo)
        val searchButton = activity?.findViewById<Button>(R.id.search_button)
        //listing all products
        when (type) {
            0 -> {
                filterImage!!.visibility = View.INVISIBLE
                searchBar!!.visibility = View.VISIBLE
                searchButton!!.visibility = View.VISIBLE
            }
            //category screen
            1 -> {
                filterImage!!.visibility = View.VISIBLE
                searchBar!!.visibility = View.INVISIBLE
                searchButton!!.visibility = View.INVISIBLE
            }
            //search screen
            2 -> {
                filterImage!!.visibility = View.VISIBLE
                searchBar!!.visibility = View.VISIBLE
                searchButton!!.visibility = View.VISIBLE
            }
        }
    }

    private fun setFilterFunction() {
        val filter = activity?.findViewById<ImageView>(R.id.filter_image)
        filter?.setOnClickListener {
            showPopupWindow(it)
        }


    }

    @SuppressLint("InflateParams")
    private fun showPopupWindowForLists(view: View) {
        Log.i("showPopup:", "here")
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.h_lists_popup_layout, null)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
        popupView.findViewById<ImageView>(R.id.dismiss_popup3).setOnClickListener {
            popupWindow.dismiss()
            listAllProducts()
        }
        //get shopping lists
        getLists(popupView)
        //add a new list to shopping lists
        popupView.findViewById<Button>(R.id.h_add_new_List_button).setOnClickListener {
            addList(popupView,popupWindow)
        }
        //delete a list from shopping lists
        popupView.findViewById<Button>(R.id.h_delete_List_button).setOnClickListener {
            deleteList(popupView,popupWindow)
        }
        //gets products from the selected shopping list
        popupView.findViewById<Button>(R.id.h_show_products).setOnClickListener {
            showListedProducts(popupView,popupWindow)


        }
    }

    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.filter_popup_layout, null)
        (activity as HomePageActivity).setVendorRadioButtons(popupView)
        (activity as HomePageActivity).setBrandRadioButtons(popupView)
        (activity as HomePageActivity).setCategoryRadioButtons(popupView)
        (activity as HomePageActivity).setRatingRadioButtons(popupView)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
        popupView.findViewById<ImageView>(R.id.dismiss_popup).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.apply_filters).setOnClickListener {
            applyFilters(popupView)
            popupWindow.dismiss()
        }
    }

    private fun applyFilters(view: View) {
        filters = hashMapOf()
        if (view.findViewById<EditText>(R.id.editminPrice).text.isNotEmpty()) {
            val minPrice = view.findViewById<EditText>(R.id.editminPrice).text.toString()
            filters?.set("fprice_lower", minPrice)
        }
        if (view.findViewById<EditText>(R.id.editmaxPrice).text.isNotEmpty()) {
            val maxPrice = view.findViewById<EditText>(R.id.editmaxPrice).text.toString()
            filters?.set("fprice_upper", maxPrice)
        }
        val selectedId = view.findViewById<RadioGroup>(R.id.radioGroupSortby).checkedRadioButtonId
        if (selectedId != -1) {
            val radioButton = view.findViewById<RadioButton>(selectedId)
            filterDictionary[radioButton.text.toString()]?.let { filters?.put("sort_by", it) }
        }
        val selectedId2 = view.findViewById<RadioGroup>(R.id.radioGroupVendors).checkedRadioButtonId
        if (selectedId2 != -1) {
            val radioButton2 = view.findViewById<RadioButton>(selectedId2)
            filters?.set("fvendor_name", radioButton2.text.toString())
        }
        val selectedId3 = view.findViewById<RadioGroup>(R.id.radioGroupCategory).checkedRadioButtonId
        if (selectedId3 != -1) {
            val radioButton3 = view.findViewById<RadioButton>(selectedId3)
            filters?.set("fcategory", radioButton3.text.toString())
        }
        val selectedId4 = view.findViewById<RadioGroup>(R.id.radioGroupBrands).checkedRadioButtonId
        if (selectedId4 != -1) {
            val radioButton4 = view.findViewById<RadioButton>(selectedId4)
            filters?.set("fbrand", radioButton4.text.toString())
        }
        val selectedId5 = view.findViewById<RadioGroup>(R.id.radioGroupRating).checkedRadioButtonId
        if (selectedId5 != -1) {
            val radioButton5 = view.findViewById<RadioButton>(selectedId5)
            filters?.set("frating_gte", radioButton5.text.toString())
        }
        //displayFragment(R.id.nav_home,2,searchString,filters)
        if (type == 2) {
            search(keys)
        } else if (type == 1) {
            displayCategory(keys)
        }
        Log.i("FilterActivity", filters.toString())
    }

    private fun search(search_string: String) {
        if (searchType == "product") {
            searchProduct(search_string)
        } else {
            searchVendor(search_string)
        }
        toggleGroup.visibility = View.VISIBLE

    }

    private fun searchVendor(search_string: String) {

        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getSearchedVendors(searchType, search_string).enqueue(object : retrofit2.Callback<List<VendorResponse>> {
            override fun onFailure(p0: Call<List<VendorResponse>>?, p1: Throwable?) {
                Log.i("SearchFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<VendorResponse>>?,
                    response: Response<List<VendorResponse>>?
            ) {

                Log.i("ProductList", productList.joinToString())
                Log.i("SearchFragment", "inside onResponse")
                if (response != null) {
                    vendorList = ArrayList(response.body()!!)
                    val adapter = context?.let { VendorAdapter(it, vendorList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }
                    }
                }
            }
        })

    }

    private fun searchProduct(search_string: String) {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        filters!!["search_type"] = searchType
        filters!!["search_string"] = search_string
        apiinterface.getSearchedProducts(filters!!).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
            override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                Log.i("SearchFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<ProductResponse>>?,
                    response: Response<List<ProductResponse>>?
            ) {

                Log.i("ProductList", productList.joinToString())
                Log.i("SearchFragment", "inside onResponse")
                if (response != null) {
                    productList = ArrayList(response.body()!!)
                    val adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }
                    }
                }
            }
        })


    }

    private fun getLists(view: View) {
        //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
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
                    Log.i("Status code", response.code().toString())
                    allLists = response.body()!!
                    val radioGroup = view.findViewById<RadioGroup>(R.id.h_radioGroupLists)
                    for (list in allLists) {
                        Log.i("List:", list)
                        val btn1 = RadioButton(activity?.applicationContext)
                        btn1.text = list
                        radioGroup.addView(btn1)
                    }


                }


            }

        })

    }

    private fun addList(view: View,window: PopupWindow){
        if(view.findViewById<EditText>(R.id.h_new_list_txt).text.isNotEmpty()){
            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val listName = view.findViewById<EditText>(R.id.h_new_list_txt).text.toString()
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addList("token f057f527f56398e8041a1985919317a5c0cc2e77", listName).enqueue(object :
                    retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<ResponseBody>?,
                        response: Response<ResponseBody>?
                ) {

                    if (response != null) {
                        Log.i("Status code",response.code().toString())
                        if(response.code()==200) {
                            Toast.makeText(context, "List has been successfully added", Toast.LENGTH_SHORT).show()
                            window.dismiss()
                            showPopupWindowForLists(view)
                        }else{
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }


            })

        }else{
            Toast.makeText(context, "Please input a list name", Toast.LENGTH_SHORT).show()
        }
    }

    private fun deleteList(view: View,window: PopupWindow){
        if(view.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = view.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteList(auth_token, listName).enqueue(object :
                    retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<ResponseBody>?,
                        response: Response<ResponseBody>?
                ) {
                    if (response != null) {
                        Log.i("Status code", response.code().toString())
                        if (response.code() == 200) {
                            Toast.makeText(context, "List has been successfully deleted", Toast.LENGTH_SHORT).show()
                            window.dismiss()
                            showPopupWindowForLists(view)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }

            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }

    }

    private fun showListedProducts(root: View,window: PopupWindow) {
        if(root.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = root.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = root.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.getListedProducts("token f057f527f56398e8041a1985919317a5c0cc2e77", listName).enqueue(object :
                    retrofit2.Callback<List<ProductResponse>> {
                override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<List<ProductResponse>>?,
                        response: Response<List<ProductResponse>>?
                ) {
                    Log.i("MainFragment", productList.joinToString())
                    Log.i("MainFragment", "inside onResponse")
                    if (response != null) {
                        productList = ArrayList(response.body()!!)

                        val adapter = context?.let { ProductAdapter(it, productList) }
                        val gridView = view?.findViewById<GridView>(R.id.gridView)
                        if (gridView != null) {
                            gridView.adapter = adapter
                            gridView.setOnItemClickListener { _, view, _, _ ->
                                val clickedId = view.findViewById<TextView>(R.id.product_id).text
                                val bundle = Bundle()
                                bundle.putString("id", clickedId.toString())
                                val newFragment = ProductPageFragment()
                                newFragment.arguments = bundle
                                val fragmentManager: FragmentManager? = activity?.supportFragmentManager
                                val fragmentTransaction: FragmentTransaction = fragmentManager!!.beginTransaction()
                                fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                                fragmentTransaction.commit()
                            }
                        }
                        window.dismiss()
                    }

                }

            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }


    }

    private fun displayAccountSubItems(view: View, type: String) {
        Log.i("accountSub: ", type)
        if (type == "Shopping Lists") {
            showPopupWindowForLists(view)
        } else if (type == "Profile") {
            displayFragment(R.id.nav_profile_detail)
        } else if (type == "Orders") {
            displayFragment(R.id.nav_customer_orders)
        }else if (type == "Products On Sale") {
            listVendorProducts()
        }

    }

    private fun listVendorProducts() {
        Log.i("listVendorProducts", "vendor product baslangic")
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductsOfVendor("token 8032e2a35b4663ae5c6d6ccfc59876dfd80b260b").enqueue(object : retrofit2.Callback<VendorDataResponse> {
            override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<VendorDataResponse>?,
                    response: Response<VendorDataResponse>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        vendorProductList=ArrayList(response.body()!!.products)
                        val adapter = context?.let { VendorProductAdapter(it, vendorProductList) }
                        val gridView = view?.findViewById<GridView>(R.id.gridView)
                        if (gridView != null) {
                            gridView.adapter = adapter
                            gridView.setOnItemClickListener { _, view, _, _ ->
                                val clickedId = view.findViewById<TextView>(R.id.product_id).text
                                val bundle = Bundle()
                                bundle.putString("id", clickedId.toString())
                                val newFragment = VendorProductPageFragment()
                                newFragment.arguments = bundle
                                val fragmentManager: FragmentManager? = fragmentManager
                                val fragmentTransaction: FragmentTransaction =
                                        fragmentManager!!.beginTransaction()
                                fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                                fragmentTransaction.commit()
                            }
                        }
                    }else{
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }


    private fun displayFragment(id: Int) {
        lateinit var fragment: Fragment
        if (id == R.id.nav_profile_detail) {
            fragment = ProfileFragment()
        }
        else if(id == R.id.nav_customer_orders){
            fragment = CustomerOrdersFragment()
        }
        activity?.supportFragmentManager?.beginTransaction()
                ?.replace(R.id.nav_host_fragment, fragment)
                ?.commit()
        (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
    }

    private fun displayCategory(type: String) {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        filters!!["name"] = type
        apiinterface.getProductsOfCategory(filters!!).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
            override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<ProductResponse>>?,
                    response: Response<List<ProductResponse>>?
            ) {
                Log.i("MainFragment", productList.joinToString())
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    productList = ArrayList(response.body()!!)
                    val adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction = fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }
                    }
                }

            }


        })
    }

    private fun listAllProducts() {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProducts().enqueue(object : retrofit2.Callback<List<ProductResponse>> {
            override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<ProductResponse>>?,
                    response: Response<List<ProductResponse>>?
            ) {
                Log.i("MainFragment", productList.joinToString())
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    productList = ArrayList(response.body()!!)
                    val adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }
                    }
                }

            }


        })
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // load foods
        Log.i("HomeFragment", "here")
        toggleGroup = view.findViewById(R.id.toggle_button_group)
        btnProduct = view.findViewById(R.id.btn_product)
        btnVendor = view.findViewById(R.id.btn_vendor)
        toggleGroup.check(btnProduct.id)
        toggleGroup.addOnButtonCheckedListener { group, checkedId, isChecked ->
            if (isChecked) {
                if (checkedId == btnProduct.id) {
                    searchType = "product"
                    search(keys)
                    activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.VISIBLE
                } else {
                    searchType = "vendor"
                    search(keys)
                    activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
                }
            } else {
                //Something is unchecked, we need to make sure that all the buttons are not un-selected
                if (-1 == group.checkedButtonId) {
                    //All buttons are unselected
                    //So now we will select the button which was unselected right now
                    group.check(checkedId)
                }
            }

        }
        when (type) {
            0 -> {
                //all products
                listAllProducts()
            }
            1 -> {
                //category
                displayCategory(keys)
            }
            2 -> {
                //search
                search(keys)
            }
            5 -> {
                //account
                Log.i("Account", "here")
                displayAccountSubItems(view, keys)
            }
            else -> {
                listAllProducts()
            }
        }
        Log.i("HomeFragment", "here")
    }


}

