<script lang="ts">
    let responseMessage: string;
    let isSending: boolean = false;
    let isSent: boolean = false;
    let to: string = '';
    let text: string = '';
  
    function spasiNomorHp(number: string): string {
      return number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
    }
  
    function ubah0Ke62(number: string): string {
      if (number.startsWith("0")) {
        return "62" + number.slice(1);
      }
      return number;
    }
  
    function handlePhoneNumberInput(event: Event) {
      const input = event.target as HTMLInputElement;
      input.value = spasiNomorHp(input.value);
      to = input.value;
    }
  
    async function submit(e: SubmitEvent) {
      e.preventDefault();
      isSending = true;
      isSent = false;
      responseMessage = '';
  
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const formattedTo = ubah0Ke62(to.replace(/-/g, '')); // Remove hyphens and convert to international format
      const text = formData.get("text") as string;
  
      const response = await fetch("/api/send-sms", {
        method: "POST",
        body: JSON.stringify({
          to: formattedTo,
          text: text
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      setTimeout(() => {
        isSending = false;
  
        if (response.ok && data.messages[0].status.groupId === 1) { // groupId 1 indicates PENDING status
          isSent = true;
          responseMessage = 'Pesan terkirim!';
        } else {
          responseMessage = 'Pesan gagal dikirim!';
        }
      }, 3000); // Delay 3 detik
    }
  </script>
  
  <form on:submit={submit}>
    <label>
        <div class="bigtitle">
            <h1>Sultan SMS</h1>
            </div>
      Nomor Tujuan
      <input type="text" id="to" name="to" placeholder="0813xxx" bind:value={to} on:input={handlePhoneNumberInput} required />
    </label>
    <label>
      Pesan
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <textarea id="text" name="text" placeholder="Isi pesan" required />
    </label>
    <button type="submit" disabled={isSending}>Kirim SMS</button>
    {#if isSending}
      Mengirim pesan...
    {/if}
    {#if responseMessage}
      {responseMessage}
    {/if}
  </form>
  