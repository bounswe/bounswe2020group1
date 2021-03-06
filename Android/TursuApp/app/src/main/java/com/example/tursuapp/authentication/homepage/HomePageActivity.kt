package com.example.tursuapp.authentication.homepage

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.cardview.widget.CardView
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import com.example.tursuapp.R
import com.example.tursuapp.adapter.ExpandableListAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.NotificationResponse
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.message.MessageFlowFragment
import com.example.tursuapp.authentication.homepage.ui.message.VendorInitiateChatFragment
import com.example.tursuapp.authentication.homepage.ui.notification.NotificationsFragment
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.homepage.ui.order.VendorOrderFragment
import com.example.tursuapp.authentication.homepage.ui.product.ProductAddFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.example.tursuapp.authentication.homepage.ui.shopping_cart.ShoppingCartFragment
import com.example.tursuapp.authentication.login.LoginActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.navigation.NavigationView
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import java.util.*
import kotlin.collections.ArrayList
import kotlin.collections.HashMap
import kotlin.concurrent.timerTask


/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
Type 5 -> account
Type 6 -> contact admin
 */
@Suppress("DEPRECATION")
class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    private var listAdapter: ExpandableListAdapter? = null
    private var expListView: ExpandableListView? = null
    private var listDataHeader: MutableList<String>? = null
    private var listDataChild: HashMap<String, List<String>>? = null
    lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle
    private var searchString = ""
    var allVendors = listOf<String>()
    var allBrands = listOf<String>()
    var allCategories = listOf<String>()
    private lateinit var userType:String
    lateinit var auth_token:String
    lateinit var newNotifications: FloatingActionButton
    lateinit var notificationsFab: FloatingActionButton
    private lateinit var linearVendors:LinearLayout
    private lateinit var linearCategories:LinearLayout
    private lateinit var linearBrands:LinearLayout
    var checkboxVendors: MutableList<CheckBox> = mutableListOf<CheckBox>()
    var checkboxBrands: MutableList<CheckBox> = mutableListOf<CheckBox>()
    var checkboxCategories: MutableList<CheckBox> = mutableListOf<CheckBox>()
    var notificationList = listOf<NotificationResponse>()


    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        //otomatik kapanması için
        drawer.closeDrawer(GravityCompat.START)
        return true
    }
    private fun setAppBar(){
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener(this)
        drawer = findViewById(R.id.drawer_layout)
        toggle = ActionBarDrawerToggle(
            this,
            drawer,
            toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )
        drawer.addDrawerListener(toggle)
        toggle.syncState()
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
    }
    fun hideSoftKeyboard(activity: Activity) {
        val inputMethodManager: InputMethodManager = activity.getSystemService(
            INPUT_METHOD_SERVICE
        ) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(
            activity.currentFocus!!.windowToken, 0
        )
    }
    //set a notifications as read
    fun readNotification(not_id:Int){
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.setNotificationRead(auth_token,not_id).enqueue(object :
                retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
            ) {
                if (response != null) {
                    if (response.code() != 200) {
                        Log.i("NotificationFragment","Problem reading the notification")
                    }
                }
            }
        })
    }
    //get all current notifications
    fun getNotifications(){
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getNotifications(auth_token).enqueue(object :
            retrofit2.Callback<List<NotificationResponse>> {
            override fun onFailure(p0: Call<List<NotificationResponse>>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<NotificationResponse>>?,
                response: Response<List<NotificationResponse>>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        notificationList = response.body()!!.reversed()
                    }
                }
            }
        })
    }
    //to see if there is an unread notification in the list, then the red bubble will show up
    fun isAllRead():Boolean{
        val isRead= notificationList.map { it.read }
        if(isRead.contains(false)){
            return false
        }
        return true
    }

    //call notifications in every 5 minutes
    @SuppressLint("UseCompatLoadingForDrawables", "UseCompatLoadingForColorStateLists")
    fun checkNotifications(){

        Timer().scheduleAtFixedRate(timerTask {
            getNotifications()
            if (!isAllRead()) {
                //set alert
                runOnUiThread {
                    // Stuff that updates the UI
                    newNotifications.visibility = View.VISIBLE
                }

            } else {
                runOnUiThread {
                    newNotifications.visibility = View.GONE
                }
            }
        }, 0, 5000)
    }
    private fun setExpandableSideMenuCustomer(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(
            this,
            it,
            it1
        ) } }
        expListView!!.setAdapter(listAdapter)

        expListView!!.setOnGroupClickListener { _, _, groupPosition, _ ->
            if (groupPosition == 1) {
                displayFragment(R.id.nav_home, 0, "", null)
            }
            else if(groupPosition == 3){
                logout()
            }

            false
        }
        expListView!!.setOnChildClickListener { _, view, groupPosition, childPosition, _ ->
            if (groupPosition == 0) {
                when (childPosition) {
                    0 -> displaySideMenuPages("Profile")
                    1 -> displaySideMenuPages("Orders")
                    // 2 -> displayFragment(R.id.nav_home, 5, "Shopping Lists", null)
                    2 -> displayFragment(R.id.nav_home, 5, "Shopping Lists", null)
                    3 -> displayFragment(R.id.nav_home, 5, "Payment", null)
                }
            }
            if (groupPosition == 2) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics", null)
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion", null)
                    2 -> displayFragment(R.id.nav_home, 1, "Home", null)
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics", null)
                    4 -> displayFragment(R.id.nav_home, 1, "Sports", null)
                }
            }

            false
        }
        expListView!!.setSelectedGroup(0)
    }
    private fun setExpandableSideMenuGuest(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(
            this,
            it,
            it1
        ) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener { _, _, groupPosition, _ ->
            if (groupPosition == 0) {
                displayFragment(R.id.nav_home, 0, "", null)
            }
            else if(groupPosition == 2){
                startLogin()
            }
            false
        }
        expListView!!.setOnChildClickListener { _, _, groupPosition, childPosition, _ ->
            if (groupPosition == 1) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics", null)
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion", null)
                    2 -> displayFragment(R.id.nav_home, 1, "Home", null)
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics", null)
                    4 -> displayFragment(R.id.nav_home, 1, "Sports", null)
                }
            }

            false
        }
        expListView!!.setSelectedGroup(0)
    }
    fun logout(){
        val pref = applicationContext.getSharedPreferences("UserPref", 0)
        if (pref != null) {
            with(pref.edit()) {
                remove("first_name")
                remove("last_name")
                remove("user_type")
                remove("auth_token")
                putBoolean("logged_in", false)
                apply()
            }
        }
        val intent = Intent(applicationContext, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
    private fun setExpandableSideMenuVendor(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(
            this,
            it,
            it1
        ) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener { _, _, groupPosition, _ ->
            if (groupPosition == 1) {
                displayFragment(R.id.nav_home, 0, "", null)
            }
            else if (groupPosition == 3) {
                displayContactAdminFragment()
            }
            else if (groupPosition == 4){
                logout()
            }
            false
        }
        expListView!!.setOnChildClickListener { _, view, groupPosition, childPosition, _ ->

                if (groupPosition == 0) {
                    when (childPosition) {
                        0 -> displaySideMenuPages("Profile")
                        1 -> displaySideMenuPages("Orders")
                        // 2 -> displayFragment(R.id.nav_home, 5, "Shopping Lists", null)
                        2 -> displaySideMenuPages("Product Add")
                        3 -> displayFragment(R.id.nav_home, 5, "My Products", null)
                    }
                }
                if (groupPosition == 2) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics", null)
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion", null)
                    2 -> displayFragment(R.id.nav_home, 1, "Home", null)
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics", null)
                    4 -> displayFragment(R.id.nav_home, 1, "Sports", null)
                }

            }


            false
        }
        expListView!!.setSelectedGroup(0)
    }
    private fun displaySideMenuPages(fragmentName: String){
        lateinit var fragment: Fragment
        if(fragmentName == "Profile"){
            fragment = ProfileFragment()
        }
        else if(fragmentName == "Orders"){
            if(userType=="vendor"){
                fragment = VendorOrderFragment()
            }
            else{
                fragment = CustomerOrdersFragment()
            }
        }
        else if(fragmentName == "Product Add"){
            fragment = ProductAddFragment()
        }
        else if(fragmentName == "My Products"){
            fragment = VendorOrderFragment()
        }

        supportFragmentManager.beginTransaction().addToBackStack(null)
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }

    private fun setSearchFunction(){
        this.findViewById<Button>(R.id.search_button).setOnClickListener {
            val editText: EditText? = findViewById(R.id.editMobileNo)
            editText?.setOnClickListener {
                editText.text?.clear()
            }
            if (editText != null) {
                searchString=editText.text.toString()
                displayFragment(R.id.nav_home, 2, searchString, null)
            }
            hideSoftKeyboard(this)
        }

        this.findViewById<CardView>(R.id.shopping_cart).setOnClickListener {
            lateinit var fragment: Fragment
            fragment = ShoppingCartFragment()

            supportFragmentManager.beginTransaction().addToBackStack(null)
                    .replace(R.id.nav_host_fragment, fragment)
                    .commit()
            this.drawer.closeDrawer(GravityCompat.START)
        }

    }
    private fun setMessageButton(){
        val fabButton = findViewById<FloatingActionButton>(R.id.message_floating_button)
        if(!(userType=="customer" || userType=="vendor")){
            fabButton.visibility = View.GONE
        }
        else {
            fabButton.setOnClickListener {
                lateinit var fragment: Fragment
                fragment = MessageFlowFragment()

                supportFragmentManager.beginTransaction().addToBackStack(null)
                        .replace(R.id.nav_host_fragment, fragment)
                        .commit()
                this.drawer.closeDrawer(GravityCompat.START)
            }
        }
    }
    private fun setNotificationButton(){
        notificationsFab = findViewById(R.id.notification_button)
        newNotifications = findViewById(R.id.new_notification)
        if(!(userType=="vendor" || userType == "customer")){
            notificationsFab.visibility = View.GONE
            newNotifications.visibility = View.GONE
        }
        else {
            notificationsFab.setOnClickListener {
                supportFragmentManager.beginTransaction().addToBackStack(null)
                        .replace(R.id.nav_host_fragment, NotificationsFragment())
                        .commit()
            }
            checkNotifications()
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val pref = getSharedPreferences("UserPref", 0)
        userType = pref?.getString("user_type", null).toString()
        auth_token = pref?.getString("auth_token", null).toString()

        getAllBrands()
        getAllCategories()
        getAllVendors()
        setContentView(R.layout.activity_home_page)
        setAppBar()
        setExpandableSideMenu()
        setSearchFunction()
        setShoppingCart()
        setMessageButton()
        setNotificationButton()
    }
    private fun setShoppingCart(){
        val sc = findViewById<CardView>(R.id.shopping_cart)
        if(userType=="customer"){
            sc.visibility = View.VISIBLE
        }
        else{
            sc.visibility = View.GONE
        }
    }
    private fun setExpandableSideMenu(){
        when (userType) {
            "customer" -> {
                setExpandableSideMenuCustomer()
            }
            "vendor" -> {
                setExpandableSideMenuVendor()
            }
            else -> {
                setExpandableSideMenuGuest()
            }
        }
    }
    private fun getAllVendors(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllVendors().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }


            override fun onResponse(
                p0: Call<List<String>>?,
                response: Response<List<String>>?
            ) {
                if (response != null) {
                    allVendors = response.body()!!
                }

            }

        })
    }
    private fun getAllBrands(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllBrands().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<String>>?,
                response: Response<List<String>>?
            ) {
                if (response != null) {
                    allBrands = response.body()!!
                }

            }

        })
    }
    private fun getAllCategories(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllCategories().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<String>>?,
                response: Response<List<String>>?
            ) {
                if (response != null) {
                    allCategories = response.body()!!
                }

            }

        })
    }
    override fun onBackPressed() {

        val count = supportFragmentManager.backStackEntryCount
        if (count == 0) {
            //super.onBackPressed()
            AlertDialog.Builder(this)
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .setTitle("Closing Activity")
                    .setMessage("Are you sure you want to exit Tursu?")
                    .setPositiveButton("Yes") { dialog, which -> super.onBackPressed() }
                    .setNegativeButton("No", null)
                    .show()


//you can add your alertdialog code here and after pressing positive button of alertdialog you can call super.onBackPressed()
        } else {
            supportFragmentManager.popBackStack()
        }



    }
    fun setVendorCheckBoxes(view: View) {
        linearVendors=view.findViewById(R.id.linear_vendors) as LinearLayout
        checkboxVendors.clear()
        for(vendor in allVendors){
            if(vendor.isNotEmpty()) {
                checkboxVendors.add(CheckBox(this))
                checkboxVendors.last().text=vendor
                checkboxVendors.last().isChecked=false
                linearVendors.addView(checkboxVendors.last())
            }
        }
    }
    /*
    fun setVendorRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupVendors)
        for(vendor in allVendors){
            val btn1 = RadioButton(this)
            btn1.text = vendor
            radioGroup.addView(btn1)
        }
    }
     */
    fun setBrandCheckBoxes(view: View) {
        linearBrands=view.findViewById(R.id.linear_brands) as LinearLayout
        checkboxBrands.clear()
        for(brand in allBrands){
            if(brand.isNotEmpty()) {
                checkboxBrands.add(CheckBox(this))
                checkboxBrands.last().text=brand
                checkboxBrands.last().isChecked=false
                linearBrands.addView(checkboxBrands.last())
            }
        }
    }
    /*
    fun setBrandRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupBrands)
        for(brand in allBrands){
            val btn1 = RadioButton(this)
            btn1.text = brand
            radioGroup.addView(btn1)
        }
    }
     */
    fun setCategoryCheckBoxes(view: View) {
        linearCategories=view.findViewById(R.id.linear_categories) as LinearLayout
        checkboxCategories.clear()
        for(category in allCategories){
            if(category.isNotEmpty()) {
                checkboxCategories.add(CheckBox(this))
                checkboxCategories.last().text=category
                checkboxCategories.last().isChecked=false
                linearCategories.addView(checkboxCategories.last())
            }
        }
    }
    /*
    fun setCategoryRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupCategory)
        for(cat in allCategories){
            val btn1 = RadioButton(this)
            btn1.text = cat
            radioGroup.addView(btn1)
        }
    }
     */
    fun setRatingRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupRating)
        val btn1 = RadioButton(this)
        btn1.text = "1+"
        val btn2 = RadioButton(this)
        btn2.text = "2+"
        val btn3 = RadioButton(this)
        btn3.text = "3+"
        val btn4 = RadioButton(this)
        btn4.text = "4+"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
        radioGroup.addView(btn4)
    }

    fun displayFragment(id: Int, type: Int, keys: String, filters: HashMap<String, String>?){
        lateinit var fragment: Fragment
        if(id == R.id.nav_home){
            fragment = HomeFragment()
        }

        val bundle = Bundle()
        bundle.putInt("type", type)
        bundle.putString("keys", keys)
        if(filters!=null){
            bundle.putSerializable("filters", filters)
        }
        Log.i("Fragg", "here")
        fragment.arguments = bundle
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    /*
     * Preparing the list data
     */
    fun displayContactAdminFragment(){
        val fragment = VendorInitiateChatFragment()
        supportFragmentManager.beginTransaction().addToBackStack(null)
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    private fun prepareListData() {
        listDataHeader = ArrayList()
        listDataChild = HashMap()

        // Adding child data

        (listDataHeader as ArrayList<String>).add("My Account")


        (listDataHeader as ArrayList<String>).add("Home")

        (listDataHeader as ArrayList<String>).add("Categories")

        if(userType=="vendor"){
            (listDataHeader as ArrayList<String>).add("Contact Admin")
        }
        if(userType!="vendor" && userType != "customer"){
            (listDataHeader as ArrayList<String>).add("Log in")
        }
        (listDataHeader as ArrayList<String>).add("Log out")


        // Adding child data
        val categoryNames: MutableList<String> = ArrayList()

        categoryNames.add("Electronics")
        categoryNames.add("Fashion")
        categoryNames.add("Home")
        categoryNames.add("Cosmetics")
        categoryNames.add("Sports")
        val accountSubItems: MutableList<String>
        // Adding child data
        if(userType=="customer"){
            accountSubItems = menuItemsForCustomer()
        }
        else{
            accountSubItems = menuItemsForVendor()
        }
        listDataChild!![(listDataHeader as ArrayList<String>)[0]] = accountSubItems
        listDataChild!![(listDataHeader as ArrayList<String>)[1]] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>)[2]] = categoryNames
        listDataChild!![(listDataHeader as ArrayList<String>)[3]] = ArrayList()
        if(userType=="vendor"){
            listDataChild!![(listDataHeader as ArrayList<String>)[4]] = ArrayList()
        }
        if (!(userType == "vendor" || userType == "customer")){
            (listDataHeader as ArrayList<String>).remove("My Account")
            (listDataHeader as ArrayList<String>).remove("Log out")
        }
    }
    fun startLogin(){
        val intent = Intent(applicationContext, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
    fun switchContent(id: Int, fragment: Fragment) {
        val ft: FragmentTransaction = supportFragmentManager.beginTransaction()
        ft.replace(id, fragment, fragment.toString())
        ft.addToBackStack(null)
        ft.commit()
    }
    fun menuItemsForVendor():MutableList<String>{
        val accountSubItems: MutableList<String> = ArrayList()
        accountSubItems.add("Profile")
        accountSubItems.add("Orders")
        //accountSubItems.add("Shopping Lists")
        accountSubItems.add("Product Add")
        accountSubItems.add("My Products")
        return accountSubItems
    }
    fun menuItemsForCustomer():MutableList<String>{
        val accountSubItems: MutableList<String> = ArrayList()
        accountSubItems.add("Profile")
        accountSubItems.add("Orders")
        accountSubItems.add("Shopping Lists")
        return accountSubItems
    }
}