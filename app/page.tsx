import {Hero} from './components/hero'
export default function Home() {
  return (
    <main>
      <Hero />
      <div>
        <div id="about">
          <section id="about">
            <h2>About</h2>
            <ul>
              <li>Peloton Interactive (2021 – Present)</li>
              <li>Paperspace (2019 – 2021)</li>
              {/* Add more experiences */}
            </ul>
          </section>
          <section id="experience">
            <h2>Experience</h2>
            <ul className="list-disc list-inside">
              <li>Peloton Interactive (2021 – Present)</li>
              <li>Paperspace (2019 – 2021)</li>
              {/* Add more experiences */}
            </ul>
          </section>
          <section id="interests">
            <h2>Interests</h2>
            <p>
              Following economic trends, new technology, competitive sports
              (basketball is my favorite), human psychology.
            </p>
          </section>
          <section id="contact">
            <h2>Contact</h2>
            <p>Email: kevin.s.kabore@gmail.com</p>
            <p>
              LinkedIn:{' '}
              <a
                href="https://www.linkedin.com/in/kevinkabore/"
                className="text-blue-600 hover:underline"
              >
                Kevin Kabor&eacute;&apos;s LinkedIn Profile
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
