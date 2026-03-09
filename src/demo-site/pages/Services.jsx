
export default function Services() {
  const services = [
    {
      id: 1,
      title: "Consulting",
      description: "Expert advice on web technologies and best practices.",
    },
    {
      id: 2,
      title: "Development",
      description: "Building modern web applications with React.",
    },
    {
      id: 3,
      title: "Support",
      description: "Ongoing support and maintenance for your projects.",
    },
  ];

  return (
    <div className="page">
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
