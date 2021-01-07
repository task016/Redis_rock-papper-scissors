import React from 'react';
import st from './Footer.css';

const footer = () => {
  const seg1 = 'md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12' + st.segmentone;
  const seg2 = 'md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12' + st.segmenttwo;
  const seg3 =
    'md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12' + st.segmentthree;
  return (
    <footer>
      <div className={st.footertop}>
        <div className='container'>
          <div className='row'>
            <div className={seg1}>
              <h2>RPS</h2>
              <p>Igrajte se besplatno</p>
            </div>
            <div className={seg2}>
              <h2>Linkovi</h2>
              <ul>
                <li>
                  <a href='/'>Tehnicka podrska</a>
                </li>
                <li>
                  <a href='/'>Kontakt</a>
                </li>
                <li>
                  <a href='/'>Recenzije</a>
                </li>
              </ul>
            </div>
            <div className={seg3}>
              <h2>Zapratite nas</h2>
              <p>
                Pomocu linkova ispod nas mozete zapratiti na drustvenim mrezama.
              </p>
              <a href='www.facebook.com'>
                <i className='fa fa-facebook'></i>
              </a>
              <a href='/'>
                <i className='fa fa-twitter'></i>
              </a>
              <a href='/'>
                <i className='fa fa-linkedin'></i>
              </a>
              <a href='/'>
                <i className='fa fa-pinterest'></i>
              </a>
            </div>
            <div className={st.segmentfour}></div>
          </div>
        </div>
      </div>
      <p className={st.footerbottomtext}>All Rights reserved by &copy;RPS</p>
    </footer>
  );
};

export default footer;
