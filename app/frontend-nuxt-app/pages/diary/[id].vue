<template>
  <navbar />
  <div class="container d-flex justify-content-center">
    <div class="w-100" style="max-width: 600px;">
      <div class="container mt-3">
        <button @click="goBack" class="btn btn-link text-decoration-none d-flex align-items-center">
          <i class="bi bi-arrow-left me-2"></i>
          Back to Posts
        </button>
      </div>
      <div v-for="item in container" :key="item?.id" class="mb-4 p-3 shadow-sm rounded">
        <h2 class="mb-3">{{item?.meta?.title}}</h2>

        <div class="d-flex align-items-center mb-2">
          <img src="../../assets/pwa-icon.png" class="rounded-circle" style="width:40px; height:40px;" alt="Icon" />
          <div class="ms-3">
            <p class="mb-0 fw-bold">Wisata Diary</p>
            <small class="text-muted">{{ item?.new_created_dt }}</small>
          </div>
        </div>

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
        
        <div class="text-center my-3">
          <img :src="item?.meta?.image" alt="News scene" class="img-fluid rounded">
        </div>

        <p>
          {{item?.content}}
        </p>

        <p class="text-muted mb-0"><small>{{item?.new_format_date_time}}</small></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const dataNews = ref([]);
const container = ref([]);

const congif = useRuntimeConfig();
const be_url = congif.public.apiBase;
const domain_url = congif.public.domainUrl
const route = useRoute();
const router = useRouter()

// function
const fetchDataNews = async () => {
  try {
      let response = await fetch(`${be_url}/cms/diary?id=${route.params.id}&status=posted`, {
          method: 'GET',
      })
      let data = await response.json()
      if (!response.ok) {
          throw data
      } else {
          dataNews.value = await data
          dataNews.value.content.map((item) => item.new_created_dt = updateFormatDate(item.created_dt))
          dataNews.value.content.map((item) => item.new_format_date_time = formatDateTime(item.created_dt))
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

const goBack = () => {
  router.push('/diary')
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

const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `${time} · ${datePart}`;
};
  
onMounted(() => {
  import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach((dropdownEl) => {
      new bootstrap.Dropdown(dropdownEl);
    });
  });

  fetchDataNews();
});

</script>

<style scoped>
.hover-bg:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>