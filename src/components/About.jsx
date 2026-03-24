import { useAdmin } from '../context/AdminContext'

export default function About() {
  const { team } = useAdmin()

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">Главные представители центра</h2>
        <div className="team-grid">
          {team.map((member) => (
            <div key={member.id} className="team-member">
              <img src={member.img} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
