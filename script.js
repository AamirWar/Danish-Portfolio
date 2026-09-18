const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const navbar = $('#navbar');
const progress = $('#scrollProgress');
const navMenu = $('#navMenu');
const menuBtn = $('#menuBtn');

menuBtn?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('#navMenu a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
}));

function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    navbar.classList.toggle('scrolled', window.scrollY > 18);
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {threshold:.08});
$$('.reveal').forEach(el => revealObserver.observe(el));

// Active navigation based on the section currently in view.
const sections = $$('main section[id]');
const navLinks = $$('#navMenu a');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
    });
}, {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => sectionObserver.observe(section));

// Hero stat counters.
const counters = $$('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = target === 5 ? '+' : '';
        let current = 0;
        const duration = 850;
        const start = performance.now();
        const tick = now => {
            const progressValue = Math.min((now - start) / duration, 1);
            current = Math.round(target * (1 - Math.pow(1 - progressValue, 3)));
            el.textContent = `${current}${suffix}`;
            if (progressValue < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
    });
}, {threshold:.7});
counters.forEach(el => counterObserver.observe(el));

// Skill filters.
$$('.skill-filter').forEach(button => button.addEventListener('click', () => {
    $$('.skill-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.skill-card').forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
}));

// Project filters.
const projectCards = $$('.project-card');
const projectCount = $('#projectCount');
$$('.project-filter').forEach(button => button.addEventListener('click', () => {
    $$('.project-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.projectFilter;
    let visible = 0;
    projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.projectCategory === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
    });
    projectCount.textContent = visible;
}));

// Project detail modal.
const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalType = $('#modalType');
const modalPeriod = $('#modalPeriod');
const modalDescription = $('#modalDescription');
function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
}
$$('.project-more').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    modalTitle.innerHTML = card.dataset.projectTitle;
    modalType.textContent = card.dataset.projectType;
    modalPeriod.textContent = card.dataset.projectPeriod;
    modalDescription.innerHTML = card.dataset.projectDescription;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
}));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// Expand/collapse detailed responsibilities.
$$('.details-toggle').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.timeline-item');
    const open = item.classList.toggle('open');
    button.innerHTML = `${open ? 'Hide' : 'Show'} responsibilities <span>${open ? '×' : '+'}</span>`;
}));

// Contact form remains front-end only; no backend is invented.
const contactForm = $('#contactForm');
const formMessage = $('#formMessage');
contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const subject = $('#subject').value.trim();
    const message = $('#message').value.trim();
    if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Please complete all fields.';
        return;
    }
    formMessage.textContent = 'Message captured. This is a front-end demo form.';
    contactForm.reset();
});

// Resume download based on the latest CV content used by this portfolio.
$('#resumeBtn')?.addEventListener('click', () => {
    const resume = `DANISH AFROOZ
MECHANICAL ENGINEER

Phone: +916005785900
Email: wardanish311@gmail.com
Location: Srinagar, J&K, India-193201

PROFESSIONAL SUMMARY
Dedicated and technically proficient Mechanical Engineer with 5+ years of experience in Diesel Generator (DG) operation, maintenance, troubleshooting, installation, and commissioning. Skilled in preventive and breakdown maintenance of diesel engines and associated mechanical systems, including cooling, lubrication, fuel, exhaust, air intake, and starting systems. Experienced in coordinating with electrical teams for AMF/ATS automatic changeover systems, HV/LV switchgear environments, DG synchronization, and load testing. Strong knowledge of equipment inspection, fault diagnosis, maintenance planning, contractor coordination, and safety procedures, with a proven focus on equipment reliability, operational efficiency, and minimizing downtime.

EXPERIENCE
ANPL - Anupam Nirman Pvt Ltd Company, Assam, India | July 2024 – Present
Senior Equipment Engineer
- Operation, maintenance and troubleshooting of Diesel Generator sets including Caterpillar, Mahindra, Kirloskar etc and associated mechanical systems.
- DG engine starting systems, battery systems, radiators, coolant circulation, fuel pumps, filters and turbochargers.
- Monitoring coolant temperature, oil pressure, fuel consumption, RPM, vibration and exhaust temperature.
- DG installation, commissioning, alignment, load testing and performance monitoring.
- HV/LV switchgear environments and safe mechanical maintenance around electrical power-generation equipment.
- Routine inspections, condition monitoring, fault diagnosis and corrective maintenance to minimize DG downtime.
- Maintenance of fuel tanks, fuel pipelines, cooling-water systems, air-intake systems, exhaust piping and ventilation systems.
- DG maintenance schedules, service activities, spare-parts requirements, equipment records and maintenance reports.
- OEM/service contractor coordination during DG major servicing, overhauling, testing and commissioning.
- Compliance with plant safety procedures, PTW/LOTO requirements and preventive-maintenance standards.

AMI - Arnavvam Metal Industries LLP Company, Assam, India | January 2022 – March 2024
Equipment Engineer
- Inspection, servicing, troubleshooting and maintenance of DG engines, alternators, cooling, lubrication, fuel, air intake, exhaust and starting systems.
- DG overhauling and replacement of engine components, filters, belts, hoses, gaskets, lubricants and coolant.
- Monitoring oil pressure, coolant temperature, RPM, voltage, frequency, load current, battery voltage and fuel consumption.
- Diagnosis and rectification of mechanical breakdowns, overheating, abnormal vibration, oil leakage, coolant leakage, starting failures and abnormal engine performance.
- Installation, commissioning and maintenance of CNC Beam Drilling Machine; drilling programs, setup instructions, tool selection, parameters and job sequence.
- Installation, commissioning and maintenance of CNC Oxy-Fuel and Plasma Cutting Machines; cutting programs, alignment, leveling, calibration, lubrication and troubleshooting.
- Installation and maintenance of Double Girder Gantry Crane 20/5 Mt and E.O.T. Crane 20/5 Mt.
- AutoCAD, Sigma NEST and Beam NC for technical drawings, nesting layouts, beam drilling programs and CNC cutting programs.
- Vendor/supplier coordination, operator training, production-process improvement and root-cause analysis.
- Equipment installation, test-running, pre-commissioning, testing and commissioning.
- Raw-material inventory, stores, warehouse operations, IT support and MS Excel records.
- SOPs for O&M and technical documentation; monthly meter readings and equipment-consumption reports.

HCC - Hindustan Construction Company Limited, Jammu & Kashmir | October 2020 – October 2021
Mechanical Engineer — 330 MW Kishanganga Hydroelectric Project
- Safety inspections/checks, safety-device verification and complete equipment records.
- Preventive/corrective maintenance, troubleshooting, lubrication and component replacement.
- Safe material handling and site equipment coordination for site preparation, landscaping, snow removal and material handling.

SKILLS
DG Systems: Diesel generators, AMF panels, ATS systems, synchronization, load testing, engine auxiliaries, DG controls.
Mechanical Systems: Diesel engines, cooling, lubrication, fuel, exhaust, air intake, pumps, valves, piping.
Electrical Environment: HV/LV panels, ACB/MCCB environments, switchgear areas, automatic changeover systems, electrical-mechanical coordination.
Maintenance: Preventive maintenance, breakdown maintenance, predictive/condition monitoring, troubleshooting, inspection, overhauling.
Documentation: Maintenance schedules, inspection reports, checklists, breakdown reports, spare-parts records, equipment history.
Safety: PTW, LOTO, PPE, risk assessment, safe maintenance practices.
Software: AutoCAD 2D & 3D, Beam NC, Sigma Nest, Smart 2D Cutting, Microsoft Office (Word, Excel, PowerPoint), Basic Computer Operations, Internet & Email, Data Entry & Data Management.

EDUCATION
B.Tech Mechanical Engineering | September 2020 | Jawaharlal Nehru Technological University Hyderabad, India | 7.02 CGPA (66.6%)
Higher Secondary / Class XII | May 2014 | The Jammu & Kashmir State Board of School Education | First Division (71.4%)

ACHIEVEMENTS / TRAINING
- Welding & inspection training programme at WRI Bharat Heavy Electricals Limited — Certificate No. S-8/04/2026.
- AutoCAD mechanical by Canter Cad — Certificate No. CC115176.
- Workshop training by Mechanical Division Baramulla J&K.
- Microsoft on essentials of excels by NCS Digi Saksham.
- Webinar on how to build virtual Assistance in Python by Learn Vern.
- Introduction to MED & manufacturing with Fusion 360 by Autodesk.

PROJECTS
- RDSO Projects Composite Girders, Bow String Girders & Open Web Girders Steel Fabrication | June 2024 – Present.
- Construction of 4-Lane Flyover Noonmati Guwahati 20000 MT Steel Girder Fabrication | April 2023 – March 2024.
- Construction of 4-Lane Flyover Maligaon Guwahati 4800 MT Steel Girder Fabrication | January 2022 – March 2024.
- Prime Minister Scheme (Jal Jeevan Mission) for Drinking Water 1500 MT Steel Tank Fabrication | June 2023 – March 2024.
- Foot over Bridge at Dibrugarh and Paltan Bazar Guwahati 200 MT Steel Fabrication | June 2023 – March 2024.
- Bow Sting Bridge (RDSO) at Jorhat 745 MT, Nalbari 99 MT, Lumding 250 MT Steel Fabrication | June 2023 – March 2024.
- Construction of Assam CM Office PEB Building (G+5) 650 MT Steel Fabrication | January 2021 – May 2023.
- 330 MW Kishanganga Hydroelectric Project, HCC Limited | October 2020 – October 2021.
- Semi-automatic spraying machine by using solar energy | June 2020 – August 2020.
- Design and Fabrication of Mini Air Conditioner | March 2020 – May 2020.
`;
    const blob = new Blob([resume], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Danish-Afrooz-Mechanical-Engineer-Resume.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});

$('#year').textContent = new Date().getFullYear();
