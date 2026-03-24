export default function Hero() {
  const scrollToForm = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Молодёжный ресурсный центр «Астана жастары» - твой старт для перемен!
          </h1>
          <p className="hero-subtitle">
            Хочешь делать что-то важное? Помогать, расти?<br />
            Присоединяйся к движению, где каждый день шаг к лучшему.<br />
            Здесь ты найдёшь команду, драйв, проекты и настоящую силу единства.
          </p>
          <button className="btn btn-primary" onClick={scrollToForm}>
            Записаться в волонтёры
          </button>
        </div>
        <div className="hero-image">
          <img
            src="/images/IMAGE 2025-06-12 17:40:31.jpg"
            alt="Волонтеры"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  )
}
