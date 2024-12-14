<template>
    <div class="skeleton-loader">
        <template v-for="index in number" :key="index">
            <div class="skeleton-loader__item rounded-md" :style="{ height: `${height}px` }" :class="`${className}`"></div>
        </template>
    </div>
</template>
  
<script>
export default {
    props: {
        height: {
            type: Number,
            default: 20
        },
        className: {
            type: String,
            default: ''
        },
        number: {
            type: Number,
            default: 3
        }
    }
}
</script>
  
<style scoped>
.skeleton-loader {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.skeleton-loader__item {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 2s infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>
  