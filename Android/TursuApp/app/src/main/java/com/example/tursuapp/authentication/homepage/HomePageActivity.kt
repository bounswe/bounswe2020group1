package com.example.tursuapp.authentication.homepage

import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.ExpandableListView
import android.widget.ExpandableListView.OnGroupClickListener
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.authentication.ExpandableListAdapter
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.google.android.material.navigation.NavigationView


class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    var listAdapter: ExpandableListAdapter? = null
    var expListView: ExpandableListView? = null
    var listDataHeader: MutableList<String>? = null
    var listDataChild: HashMap<String, List<String>>? = null

    private lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle


    override fun onNavigationItemSelected(item: MenuItem): Boolean {
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
        toggle.syncState();
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false);
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener(OnGroupClickListener { parent, v, groupPosition, id ->
            when (groupPosition) {
                0 -> displayFragment(R.id.nav_home)
            }
            false
        })
        expListView!!.setOnChildClickListener(ExpandableListView.OnChildClickListener { parent, v, groupPosition, childPosition, id ->
            // Kategoriye basılınca olacakları ayarla
            false
        })

    }
    override fun onBackPressed() {
        val count = fragmentManager.backStackEntryCount
        if (count == 0) {
            super.onBackPressed()
        } else {
            fragmentManager.popBackStack()
        }
    }
    fun displayFragment(id: Int){
        lateinit var fragment: Fragment
        when (id) {
            R.id.nav_home -> fragment = HomeFragment()
        }
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
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
        /*# category1 --> Electronics
    # category2 --> Fashion
    # category3 --> Home
    # category4 --> Cosmetics
    # category5 --> Sports
*/
        category_names.add("Electronics")
        category_names.add("Fashion")
        category_names.add("Home")
        category_names.add("Cosmetics")
        category_names.add("Sports")
        listDataChild!![(listDataHeader as ArrayList<String>).get(0)] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>).get(1)] = category_names
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }

}