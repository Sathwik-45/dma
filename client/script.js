document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
  
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
  
      const result = await response.json();
      alert(result.message || 'Message sent!');
      e.target.reset();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to send message');
    }
  });
  