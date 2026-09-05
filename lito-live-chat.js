(() => {
  const config = {
    url: "https://irdbpnzwqlxniswhwada.supabase.co",
    key: "sb_publishable_bRG--fNRut5x43Wqa9oFFA_ffe9gxrG",
    storage: "lito-live-chat-v4"
  };
  const blank = () => ({ id: "", token: "", name: "", email: "", messages: [] });
  const read = () => {
    try { return { ...blank(), ...JSON.parse(sessionStorage.getItem(config.storage) || "{}") }; }
    catch { return blank(); }
  };
  const write = value => sessionStorage.setItem(config.storage, JSON.stringify(value));
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const rpc = async (method, body) => {
    const response = await fetch(`${config.url}/rest/v1/rpc/${method}`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", apikey: config.key, Authorization: `Bearer ${config.key}` },
      body: JSON.stringify(body)
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(raw || "The chat service did not respond.");
    return raw ? JSON.parse(raw) : [];
  };
  const start = () => {
    let state = read();
    const root = make("aside", "lito-live-chat");
    const launcher = make("button", "lito-live-chat-launcher"); launcher.setAttribute("aria-label", "Open chat"); launcher.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></svg>';
    const panel = make("section", "lito-live-chat-panel");
    const header = make("header", "lito-live-chat-header");
    const title = make("strong", "", "Chat with Lito Tech");
    const close = make("button", "lito-live-chat-close", "×");
    const transcript = make("div", "lito-live-chat-transcript");
    const form = make("form", "lito-live-chat-form");
    const identity = make("div", "lito-live-chat-identity");
    const name = document.createElement("input");
    const email = document.createElement("input");
    const message = document.createElement("textarea");
    const send = make("button", "lito-live-chat-send", "Send message");
    const newChat = make("button", "lito-live-chat-new", "New chat");
    const status = make("p", "lito-live-chat-status", "");
    const label = (text, input) => { const field = make("label", "lito-live-chat-field"); field.append(make("span", "", text), input); return field; };
    launcher.type = close.type = "button";
    send.type = "submit";
    name.required = email.required = message.required = true;
    name.placeholder = "Your name"; email.placeholder = "you@example.com"; email.type = "email";
    message.placeholder = "How can we help?"; message.rows = 3;
    name.value = state.name; email.value = state.email;
    const render = () => {
      identity.hidden = Boolean(state.id);
      transcript.innerHTML = "";
      state.messages.forEach(item => {
        const bubble = make("article", `lito-live-chat-message ${item.sender === "visitor" ? "is-visitor" : "is-team"}`);
        bubble.append(make("p", "", item.text));
        transcript.append(bubble);
      });
      transcript.scrollTop = transcript.scrollHeight;
    };
    const refresh = async () => {
      if (!state.id || !state.token) return;
      try {
        const rows = await rpc("get_visitor_chat_messages", { p_conversation_id: state.id, p_visitor_token: state.token });
        state.messages = rows.map(row => ({ sender: row.sender_type, text: row.message, createdAt: row.created_at }));
        write(state); render();
        status.textContent = "";
      } catch (error) {
        status.textContent = "We could not check for replies. Please keep this chat open.";
        status.className = "lito-live-chat-status is-error";
        console.error(error);
      }
    };
    const notifyByEmail = async () => {
      if (!state.id || !state.token) return;
      try {
        const response = await fetch(`${config.url}/functions/v1/chat-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: config.key },
          body: JSON.stringify({ conversationId: state.id, visitorToken: state.token })
        });
        if (!response.ok) console.warn("Inquiry email notification failed.", await response.text());
      } catch (error) { console.warn("Inquiry email notification failed.", error); }
    };
    const open = () => { root.classList.add("is-open"); render(); refresh(); };
    launcher.onclick = () => root.classList.contains("is-open") ? root.classList.remove("is-open") : open();
    close.onclick = () => root.classList.remove("is-open");
    form.onsubmit = async event => {
      event.preventDefault();
      const text = message.value.trim();
      if (!text) return;
      send.disabled = true; status.textContent = "Sending…"; status.className = "lito-live-chat-status";
      try {
        if (!state.id) {
          const created = await rpc("start_chat_conversation", {
            p_visitor_name: name.value.trim(), p_visitor_email: email.value.trim(), p_source_page: location.href, p_message: text
          });
          const conversation = created[0];
          if (!conversation?.conversation_id || !conversation?.visitor_token) throw new Error("A chat session was not created.");
          state = { id: conversation.conversation_id, token: conversation.visitor_token, name: name.value.trim(), email: email.value.trim(), messages: [] };
        } else {
          await rpc("send_visitor_chat_message", { p_conversation_id: state.id, p_visitor_token: state.token, p_message: text });
        }
        state.messages.push({ sender: "visitor", text, createdAt: new Date().toISOString() });
        write(state); render(); message.value = "";
        status.textContent = "Message sent. We will reply here."; status.className = "lito-live-chat-status is-success";
        refresh();
        void notifyByEmail();
      } catch (error) {
        status.textContent = `Message not sent: ${error.message}`; status.className = "lito-live-chat-status is-error";
        console.error(error);
      } finally { send.disabled = false; }
    };
    header.append(title, close);
    identity.append(label("Name", name), label("Email", email));
    form.append(identity, label("Message", message), send, status);
    panel.append(header, transcript, form); root.append(panel, launcher); document.body.append(root); render(); setInterval(refresh, 4000);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start, { once: true }) : start();
})();