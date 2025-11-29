renderTickets = (tickets = []) => {
    for (let ticket of tickets)  {
        if (tickets.length >= 4) break;

        if (!ticket) continue;

        const indexStr = String(tickets.length + 1).padStart(2, 0);

        console.log(indexStr)
        const lblTicket = document.querySelector(`#lbl-ticket-${ indexStr }`)
        const lblDesk = document.querySelector(`#lbl-desk-${ indexStr }`)

        lblTicket.innerHTML = `Ticket ${ ticket.number }`;
        lblDesk.innerHTML = `Ticket ${ ticket.handleAtDesk }`;
    };
}

loadCurrentTicket = async() => {
    const tickets = await fetch('/api/ticket/working-on').then(resp => resp.json());
    renderTickets(tickets);
}

connectToWebSockets = () => {
  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = ( event ) => {
    const {type, payload} = JSON.parse(event.data);
    if (type !== 'on-working-on-changed') return;
    renderTickets(payload)
  };

  socket.onclose = ( event ) => {
    setTimeout( () => {
      connectToWebSockets();
    }, 1500 );
  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };
}

//Init
loadCurrentTicket();
connectToWebSockets();