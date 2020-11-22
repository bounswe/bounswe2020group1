package com.example.tursuapp.authentication.homepage

import android.app.Activity
import android.content.res.Configuration
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.ExpandableListView
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.ui.AppBarConfiguration
import com.example.tursuapp.R
import com.example.tursuapp.authentication.ExpandableListAdapter
import com.google.android.material.navigation.NavigationView


class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    var listAdapter: ExpandableListAdapter? = null
    var expListView: ExpandableListView? = null
    var listDataHeader: MutableList<String>? = null
    var listDataChild: HashMap<String, List<String>>? = null
    private lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onNavigationItemSelected(item: MenuItem): Boolean {

        when (item.itemId) {
            //R.id.nav_item_one -> Toast.makeText(this, "Clicked item one", Toast.LENGTH_SHORT).show()
            //R.id.nav_item_two -> Toast.makeText(this, "Clicked item two", Toast.LENGTH_SHORT).show()
            //R.id.nav_item_three -> Toast.makeText(this, "Clicked item three", Toast.LENGTH_SHORT).show()
            //R.id.nav_item_four -> Toast.makeText(this, "Clicked item four", Toast.LENGTH_SHORT).show()
        }
        //otomatik kapanması için
        drawer.closeDrawer(GravityCompat.START)
        return true
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener(this)
        drawer = findViewById(R.id.drawer_layout)

        toggle = ActionBarDrawerToggle(this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)

        drawer.addDrawerListener(toggle)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false);
        //toggle.getDrawerArrowDrawable().setColor(getResources().getColor(R.color.white));
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)

    }

    /*
     * Preparing the list data
     */
    private fun prepareListData() {
        listDataHeader = ArrayList()
        listDataChild = HashMap()

        // Adding child data
        (listDataHeader as ArrayList<String>).add("Home")
        (listDataHeader as ArrayList<String>).add("Categories")

        // Adding child data
        val category_names: MutableList<String> = ArrayList()
        category_names.add("Cat 1")
        category_names.add("Cat 2")
        category_names.add("Cat 3")
        category_names.add("Cat 4")

        listDataChild!![(listDataHeader as ArrayList<String>).get(0)] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>).get(1)] = category_names
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }
}