<template>
  <div v-if="!route.params.id">
    <navbar />
    <div class="container d-flex justify-content-center">
      <div class="w-100" style="max-width: 600px;">
        <div v-for="item in container" :key="item?.id" class="mb-4 p-3 shadow-sm rounded">
          <!-- Header section -->
          <div class="d-flex align-items-center mb-2">
            <img src="../../assets/pwa-icon.png" class="rounded-circle" style="width:40px; height:40px;" alt="Icon" />
            <div class="ms-3">
              <p class="mb-0 fw-bold">Wisata Diary</p>
              <small class="text-muted">{{ item?.created_dt }}</small>
            </div>
          </div>

          <!-- Card section -->
          <div class="card" style="cursor: pointer" @click="goToItem(item?.id)">
            <img :src="item?.meta?.image" class="card-img-top img-fluid" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">{{ item?.meta?.title }}</h5>
              <p class="card-text">{{ item?.meta?.description }}</p>
            </div>
          </div>

          <!-- Share button -->
          <div class="text-end mt-2 dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Share
            </button>
            <ul class="dropdown-menu">
              <li>
                <a :href="getTwitterShareUrl(item)" class="dropdown-item" target="_blank">
                  <i class="bi bi-twitter me-2"></i>Twitter
                </a>
              </li>
              <li>
                <a :href="getFacebookShareUrl(item)" class="dropdown-item" target="_blank">
                  <i class="bi bi-facebook me-2"></i>Facebook
                </a>
              </li>
              <li>
                <a :href="getWhatsappShareUrl(item)" class="dropdown-item" target="_blank">
                  <i class="bi bi-whatsapp me-2"></i>WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const congif = useRuntimeConfig();
const be_url = congif.public.apiBase;
const domain_url = congif.public.domainUrl
const dataNews = ref({});
const hasMore = ref(true);
const container = ref([]);
const loading = ref(false);
const route = useRoute();
const router = useRouter();

let offset = 0;
let limit = 20;

// function
const fetchDataNews = async () => {
  try {
      let response = await fetch(`${be_url}/cms/diary?context=diary&offset=${offset}&limit=${limit}&status=posted`, {
          method: 'GET',
      })
      let data = await response.json()
      if (!response.ok) {
          throw data
      } else {
          dataNews.value = await data
          dataNews.value.content.map((item) => item.created_dt = updateFormatDate(item.created_dt))
          dataNews.value.content.map((item) => container.value.push(item))
      }
  } catch (error) {
      console.log(error, 'error')
  }
}

const updateFormatDate = (current_date) => {
  const isoString = current_date;
  const date = new Date(isoString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate
}

const loadMore = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  offset = offset + 20
  limit = limit + 20

  let response = await fetch(`${be_url}/cms/diary?context=diary&offset=${offset}&limit=${limit}&status=posted`, {
      method: 'GET',
  })

  let data = await response.json()
  if (!response.ok) {
      throw data
  } else {
      dataNews.value = await data
      if (Object.keys(dataNews.value).length === 0) {
          hasMore.value = false
      } else {
          dataNews.value.content.map((item) => item.created_dt = updateFormatDate(item.created_dt))
          dataNews.value.content.map((item) => container.value.push(item))
      }
  }
  loading.value = false
}

const handleScroll = () => {
const scrollTop = window.scrollY
const scrollBottom = scrollTop + window.innerHeight
const docHeight = document.documentElement.offsetHeight

if (scrollBottom >= docHeight - 100) {
  loadMore()
}
}

const goToItem = (id) => {
router.push(`/diary/${id}`)
}

const getCurrentUrl = (item) => {
  return `${domain_url}/diary/${item.id}`
}

const getTwitterShareUrl = (item) => {
  const url = encodeURIComponent(getCurrentUrl(item))
  const text = encodeURIComponent(item.meta?.title || 'Check this out')
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
}

const getFacebookShareUrl = (item) => {
  const url = encodeURIComponent(getCurrentUrl(item))
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`
}

const getWhatsappShareUrl = (item) => {
  const url = encodeURIComponent(getCurrentUrl(item))
  const text = encodeURIComponent(item.meta?.title || '')
  return `https://wa.me/?text=${text}%20${url}`
}

onMounted(async () => {
  const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
  const dropdownElements = document.querySelectorAll('.dropdown-toggle');
  dropdownElements.forEach((dropdownEl) => {
    new bootstrap.Dropdown(dropdownEl);
  });

  if (!route.params.id) {
    await fetchDataNews();
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.hover-bg:hover {
background-color: #f0f0f0;
cursor: pointer;
}
</style>