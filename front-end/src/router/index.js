import Vue from 'vue';
import VueRouter from 'vue-router';
import { store } from '../store/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/createAccount',
    name: 'createAccount',
    component: () => import('../views/CreateAccount.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/passwordReset',
    name: 'passwordReset',
    component: () => import('../views/PasswordReset.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/Progress.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue'),
    props(route) {
      return route.query || {}
    },
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  function isLoggedIn() {
    return store.getters.authenticated
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Going to authenticated page, without being logged in
    if (!isLoggedIn()) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {  // Going to authenticated page, is logged in
      if (to.matched.some(record => record.meta.is_admin)) {
        //TODO: Add admin handling
        next({ name: 'home' })
      } else {
        if(from.name === "createAccount"){
          store.commit('updateFirstLogin', true)
        }
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!isLoggedIn()) {
      next()
    }
    else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})
export default router;
