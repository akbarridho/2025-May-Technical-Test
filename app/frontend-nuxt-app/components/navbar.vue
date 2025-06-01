<template>
    <div 
      class="d-flex justify-content-between align-items-center sticky-top bg-white px-3 px-md-5 py-2 shadow-sm"
      style="z-index: 1050;"
    >
      <div>
        <img src="../assets/wisata_diary.png" alt="Wisata Diary Logo" style="max-width: 200px; height: 50px;" />
      </div>

      <div>
        <button type="button" class="btn btn-primary">
          Sign In
        </button>
      </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.sticky-header {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1050;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>