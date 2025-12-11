export const generateBidHTML = (bid: any, items: any[], client: any, profile: any) => {
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const date = new Date().toLocaleDateString();

    return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { max-width: 150px; max-height: 80px; }
          .company-info { text-align: right; }
          .company-name { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #1e293b; }
          .meta { margin-bottom: 40px; }
          .client-box { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { text-align: left; background: #f1f5f9; padding: 12px; border-bottom: 2px solid #e2e8f0; }
          .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .total-section { text-align: right; margin-top: 20px; }
          .final-total { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            ${profile?.logo_url ? `<img src="${profile.logo_url}" class="logo" />` : ''}
          </div>
          <div class="company-info">
            <div class="company-name">${profile?.company_name || 'Professional Painter'}</div>
            <div>${profile?.email || ''}</div>
          </div>
        </div>

        <div class="meta">
          <div class="title">Estimate #${bid.id ? bid.id.slice(0, 8).toUpperCase() : 'DRAFT'}</div>
          <div>Date: ${date}</div>
        </div>

        <div class="client-box">
          <strong>Prepared For:</strong><br>
          ${client?.name || 'Valued Client'}<br>
          ${client?.address || ''}<br>
          ${client?.email || ''}<br>
          ${client?.phone || ''}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 60%">Description</th>
              <th style="width: 15%">Qty</th>
              <th style="width: 15%">Unit Price</th>
              <th style="width: 10%">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${parseFloat(item.unit_price).toFixed(2)}</td>
                <td>$${(parseFloat(item.quantity) * parseFloat(item.unit_price)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div>Total Estimate</div>
          <div class="final-total">$${total.toFixed(2)}</div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This estimate is valid for 30 days.</p>
        </div>
      </body>
    </html>
  `;
};
