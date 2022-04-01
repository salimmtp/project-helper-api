module.exports = (link, heading, para) => `<div style="background: #eeeeee; padding-top: 20px;">
<div class="adM"></div>
<div style="max-width: 800px; margin: 0 auto;">
  <div class="adM"></div>
  <table cellpadding="0" cellspacing="0" width="100%">
    <tbody>
      <tr>
        <td align="center">
          <div>
            <a
              href="https://www.dmu.ac.uk"
              title="dmu"
              target="_blank"
              ><img
                src="https://dmu-project-helper.herokuapp.com/dmu.png"
                width="220"
                height="67"
                alt="dmu"
                style="
                  border: none;
                  clear: both;
                  display: block;
                  margin: 0;
                  max-width: 100%;
                  outline: 0;
                  padding: 0;
                  text-decoration: none;
                  vertical-align: baseline;
                  width: auto;
                "
            /></a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div
    style="
      color: #2e3e48;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.3;
      background: #fff;
      margin: 20px;
      border-radius: 6px;
    "
  >
    <div style="padding: 20px 50px; border-bottom: 1px solid #eee; min-height: 220px">
        <p style="Margin:0;Margin-bottom:0;color:#373b42;font-family:Roboto,Helvetica,sans-serif;font-size:30px;font-weight:500!important;line-height:1.3;margin:0;margin-bottom:0;padding:0;text-align:left">${heading}</p>
        <br />
        <p style="color: #72757a;
        font-family: Roboto,Helvetica,sans-serif;
        font-size: 16px;
        font-weight: 400!important;
        line-height: 1.3;
        margin: 0;
        margin-top: 10px;
        padding: 0;
        text-align: left;">${para}</p>
        <br />
      
        <table style="Margin:0 0 16px 0;border-collapse:collapse;border-spacing:0;margin:0 0 16px 0;margin-bottom:0!important;padding:0;text-align:left;vertical-align:top;width:auto">
        <tbody>
          <tr style="padding:0;text-align:left;vertical-align:top">
            <td style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Roboto,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                <tbody>
                  <tr style="padding:0;text-align:left;vertical-align:top">
                    <td style="Margin:0;background:#4687ff;border:none;border-collapse:collapse!important;border-radius:3px;color:#fefefe;font-family:Roboto,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><a style="Margin:0;border:0 solid #4687ff;border-radius:3px;color:#fefefe;display:inline-block;font-family:Roboto,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.3;margin:0;padding:17px 30px;text-align:left;text-decoration:none" 
                    href="${link}" target="_blank"><span class="il">Verify</span> <span class="il">Email</span></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
  </div>

  <table align="center" cellspacing="0" cellpadding="10" width="100%" bgcolor="#eeeeee">
    <tbody>
      <tr>
        <td align="center">
          <table cellspacing="0" cellpadding="0" align="center">
            <tbody>
              <tr>
                <td width="650" style="text-align: left; font-family: helvetica, arial, sans-serif; color: #626262;">
                  <p style="font-size: 10px; margin-bottom: 0.25em; color: #626262;">
                    This is an automatically generated email, please do not reply
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>`;
