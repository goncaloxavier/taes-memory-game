<template>
    <div >
      <h1>You Won!</h1>
      <h3>Score: {{finalScore}}</h3>
    </div>
    <div>
  <RouterLink class="secondary-btn bounce-in" :to="{name: 'Dashboard'}">Go back</RouterLink>    </div>
  </template>
  
<script setup>

  defineProps({
    finalScore: {
      type: Number,
      required: true
    }
  });

</script>



  <style scoped>

  .secondary-btn {
    background-color: #6c757d;
    color: white;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  h1 {
    font-size: 48px;
    margin-bottom: 20px;
    animation: bounceIn 0.8s ease-out;
  }

  h3 {
    font-size: 24px;
    margin-bottom: 20px;
    animation: bounceIn 0.8s ease-out;
  }
  
  p {
    font-size: 24px;
    max-width: 400px;
    text-align: center;
    margin-bottom: 40px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #007bff;
    color: white;
  }
  
  @keyframes bounceIn {
    0% { transform: translateY(2000px); opacity: 0; }
    50% { transform: translateY(-30px); opacity: 1; }
    80% { transform: translateY(20px); }
    100% { transform: translateY(0); }
  }

  .bounce-in {
  animation: bounceIn 0.8s ease-out;
}
  </style>
