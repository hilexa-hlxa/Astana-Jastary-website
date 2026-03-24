export default function Contacts() {
  return (
    <section id="contacts" className="contacts">
      <div className="container">
        <h2 className="section-title">Свяжись с нами</h2>
        <div className="contacts-content">
          <div className="contact-info">
            <div className="contact-item">
              <strong>Телефон:</strong> +7 701 356 2296 (Эльвира Е.)
            </div>
            <div className="contact-item">
              <strong>Эл. адрес:</strong> kgu.astanajastary@mail.ru
            </div>
            <div className="contact-item">
              <strong>Адрес:</strong> Сарыарка 13
            </div>
            <div className="contact-item">
              <strong>График работы:</strong><br />
              График: с 10:00 до 18:00<br />
              Обед 13:00 - 14:30<br />
              Понедельник - пятница
            </div>
          </div>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2501.9913954665676!2d71.40742917669897!3d51.16394803573537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424586d6c8109391%3A0x1bcec13c1f63cd64!2z0JDQutC40LzQsNGCINGA0LDQudC-0L3QsCAi0KHQsNGA0YvQsNGA0LrQsCIg0LPQvtGA0L7QtNCwINCQ0YHRgtCw0L3Riw!5e0!3m2!1sru!2skz!4v1749623024117!5m2!1sru!2skz"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта офиса"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
