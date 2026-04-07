package com.EVENTORA.service;

import com.EVENTORA.domain.Event;
import com.EVENTORA.domain.Seat;
import com.EVENTORA.repository.EventRepository;
import com.EVENTORA.repository.SeatRepository;
import com.EVENTORA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Seeds real-world event data mimicking BookMyShow events from India.
 * Events include concerts, sports, comedy, theatre, movies, conferences.
 * BMS doesn't have a public API; this service provides rich, authentic data
 * with real artists, venues, cities, and pricing matching BMS trends.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EventSeedService implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (eventRepository.count() > 0) {
            log.info("Events already seeded. Skipping.");
            return;
        }

        log.info("Seeding real-world events...");

        // Get a system user for created_by (or create a placeholder UUID)
        UUID systemUserId = userRepository.findAll()
                .stream()
                .findFirst()
                .map(u -> u.getId())
                .orElse(UUID.fromString("00000000-0000-0000-0000-000000000001"));

        List<Event> events = buildEvents(systemUserId);
        List<Event> savedEvents = eventRepository.saveAll(events);

        // Generate seats for each event
        for (Event event : savedEvents) {
            generateSeatsForEvent(event);
        }

        log.info("Successfully seeded {} events with seats.", savedEvents.size());
    }

    private List<Event> buildEvents(UUID createdBy) {
        return Arrays.asList(
            // ======================== CONCERTS ========================
            Event.builder()
                .title("Coldplay: Music Of The Spheres World Tour")
                .description("Experience the magic of Coldplay live! Music Of The Spheres World Tour brings Chris Martin and band to India for an unforgettable night filled with light shows, spectacular visuals, and all their greatest hits from Yellow to My Universe.")
                .category("CONCERT")
                .city("Mumbai")
                .venue("DY Patil Sports Stadium")
                .venueAddress("D Y Patil Rd, Sector 7, Nerul, Navi Mumbai, Maharashtra 400706")
                .latitude(new BigDecimal("19.0422"))
                .longitude(new BigDecimal("73.0167"))
                .eventDate(LocalDateTime.of(2026, 11, 19, 19, 0))
                .durationMinutes(180)
                .basePrice(new BigDecimal("4500"))
                .totalSeats(500)
                .demandScore(new BigDecimal("4.9"))
                .popularityPercentile(new BigDecimal("99"))
                .bannerImageUrl("https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Coldplay")
                .genre("Pop/Rock")
                .language("English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Arijit Singh Live: An Evening of Melodies")
                .description("India's most beloved singer Arijit Singh performs live in an enchanting evening of soulful melodies. From Tum Hi Ho to Kesariya, experience every emotion through his magical voice.")
                .category("CONCERT")
                .city("Bangalore")
                .venue("Palace Grounds")
                .venueAddress("Jayamahal Rd, Vasanth Nagar, Bengaluru, Karnataka 560080")
                .latitude(new BigDecimal("13.0066"))
                .longitude(new BigDecimal("77.5939"))
                .eventDate(LocalDateTime.of(2026, 10, 10, 18, 30))
                .durationMinutes(150)
                .basePrice(new BigDecimal("2500"))
                .totalSeats(600)
                .demandScore(new BigDecimal("4.8"))
                .popularityPercentile(new BigDecimal("98"))
                .bannerImageUrl("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Arijit Singh")
                .genre("Bollywood/Romantic")
                .language("Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("A.R. Rahman: Harmony - The Musical Journey")
                .description("The Mozart of Madras, A.R. Rahman, brings his award-winning compositions to life. A symphony of timeless hits from Roja to Slumdog Millionaire, featuring a 100-piece live orchestra.")
                .category("CONCERT")
                .city("Chennai")
                .venue("YMCA Nandanam Grounds")
                .venueAddress("Nandanam, Chennai, Tamil Nadu 600035")
                .latitude(new BigDecimal("13.0226"))
                .longitude(new BigDecimal("80.2393"))
                .eventDate(LocalDateTime.of(2026, 12, 6, 19, 0))
                .durationMinutes(180)
                .basePrice(new BigDecimal("3000"))
                .totalSeats(800)
                .demandScore(new BigDecimal("4.9"))
                .popularityPercentile(new BigDecimal("99"))
                .bannerImageUrl("https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("A.R. Rahman")
                .genre("Fusion/Classical/Film")
                .language("Tamil/Hindi/English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Dua Lipa: Future Nostalgia Tour India")
                .description("Pop sensation Dua Lipa makes her India debut! Dance the night away to hits like Levitating, Don't Start Now, and Physical. A high-energy production with stunning light shows and choreography.")
                .category("CONCERT")
                .city("Delhi")
                .venue("Jawaharlal Nehru Stadium")
                .venueAddress("Bhishma Pitamah Marg, Lodhi Road, New Delhi 110003")
                .latitude(new BigDecimal("28.5818"))
                .longitude(new BigDecimal("77.2226"))
                .eventDate(LocalDateTime.of(2026, 10, 25, 20, 0))
                .durationMinutes(150)
                .basePrice(new BigDecimal("5999"))
                .totalSeats(700)
                .demandScore(new BigDecimal("4.7"))
                .popularityPercentile(new BigDecimal("96"))
                .bannerImageUrl("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Dua Lipa")
                .genre("Pop/Dance")
                .language("English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Shreya Ghoshal: Shree Rama Chandra Live")
                .description("The nightingale of India, Shreya Ghoshal, presents a spellbinding live performance. Experience her golden voice performing classical, devotional, and film songs in one breathtaking evening.")
                .category("CONCERT")
                .city("Hyderabad")
                .venue("Hitex Exhibition Centre")
                .venueAddress("HITEX City, Hyderabad, Telangana 500084")
                .latitude(new BigDecimal("17.4567"))
                .longitude(new BigDecimal("78.3777"))
                .eventDate(LocalDateTime.of(2026, 11, 8, 18, 0))
                .durationMinutes(150)
                .basePrice(new BigDecimal("1800"))
                .totalSeats(550)
                .demandScore(new BigDecimal("4.5"))
                .popularityPercentile(new BigDecimal("90"))
                .bannerImageUrl("https://images.unsplash.com/photo-1501386761578-eaa54b517f62?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Shreya Ghoshal")
                .genre("Bollywood/Classical")
                .language("Hindi/Tamil/Telugu")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Ed Sheeran: Mathematics Tour India")
                .description("Ed Sheeran returns to India with his critically acclaimed Mathematics Tour. Solo storytelling at its finest — just Ed, his loop pedal, and a sea of lighters. Shape of You, Perfect, Bad Habits, and many more.")
                .category("CONCERT")
                .city("Pune")
                .venue("Shree Shiv Chhatrapati Sports Complex")
                .venueAddress("Balewadi, Pune, Maharashtra 411045")
                .latitude(new BigDecimal("18.5684"))
                .longitude(new BigDecimal("73.7741"))
                .eventDate(LocalDateTime.of(2026, 12, 15, 19, 30))
                .durationMinutes(180)
                .basePrice(new BigDecimal("3500"))
                .totalSeats(600)
                .demandScore(new BigDecimal("4.6"))
                .popularityPercentile(new BigDecimal("93"))
                .bannerImageUrl("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Ed Sheeran")
                .genre("Pop/Folk")
                .language("English")
                .createdBy(createdBy)
                .build(),

            // ======================== SPORTS ========================
            Event.builder()
                .title("IPL 2026: MI vs CSK - The El Clasico of Cricket")
                .description("The most iconic rivalry in cricket returns! Mumbai Indians face Chennai Super Kings in this blockbuster IPL clash. The old rivals battle it out under the lights in what promises to be a thriller.")
                .category("SPORTS")
                .city("Mumbai")
                .venue("Wankhede Stadium")
                .venueAddress("D Rd, Churchgate, Mumbai, Maharashtra 400020")
                .latitude(new BigDecimal("18.9389"))
                .longitude(new BigDecimal("72.8254"))
                .eventDate(LocalDateTime.of(2026, 10, 12, 19, 30))
                .durationMinutes(240)
                .basePrice(new BigDecimal("1000"))
                .totalSeats(800)
                .demandScore(new BigDecimal("4.9"))
                .popularityPercentile(new BigDecimal("99"))
                .bannerImageUrl("https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("T20 Cricket")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("India vs Australia: 3rd ODI - Battle for the Series")
                .description("India and Australia face off in a decisive ODI clash. With the series tied, everything is on the line at this epic encounter. Cheer your team live as both sides battle it out for supremacy.")
                .category("SPORTS")
                .city("Bangalore")
                .venue("M. Chinnaswamy Stadium")
                .venueAddress("MG Rd, Shivaji Nagar, Bengaluru, Karnataka 560001")
                .latitude(new BigDecimal("12.9793"))
                .longitude(new BigDecimal("77.5996"))
                .eventDate(LocalDateTime.of(2026, 11, 3, 14, 0))
                .durationMinutes(480)
                .basePrice(new BigDecimal("800"))
                .totalSeats(700)
                .demandScore(new BigDecimal("4.8"))
                .popularityPercentile(new BigDecimal("97"))
                .bannerImageUrl("https://images.unsplash.com/photo-1540747913346-19212a4d9e8b?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("ODI Cricket")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Pro Kabaddi League: Season 11 Grand Finale")
                .description("The electrifying finale of Pro Kabaddi League Season 11! The top two teams battle it out for the championship title in front of a packed stadium. India's favourite contact sport at its absolute best.")
                .category("SPORTS")
                .city("Hyderabad")
                .venue("CAMS - Gachibowli Indoor Stadium")
                .venueAddress("Gachibowli, Hyderabad, Telangana 500032")
                .latitude(new BigDecimal("17.4485"))
                .longitude(new BigDecimal("78.3504"))
                .eventDate(LocalDateTime.of(2026, 10, 30, 20, 0))
                .durationMinutes(180)
                .basePrice(new BigDecimal("500"))
                .totalSeats(400)
                .demandScore(new BigDecimal("4.3"))
                .popularityPercentile(new BigDecimal("82"))
                .bannerImageUrl("https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Kabaddi")
                .language("Hindi/Telugu")
                .createdBy(createdBy)
                .build(),

            // ======================== COMEDY ========================
            Event.builder()
                .title("Zakir Khan: Yaara Dildaara Live")
                .description("\"Sakht Launda\" Zakir Khan brings his legendary stand-up special to your city. Hilarious observations about love, family, and being an average Indian man. Prepare to laugh till your stomach hurts!")
                .category("COMEDY")
                .city("Delhi")
                .venue("Siri Fort Auditorium")
                .venueAddress("Siri Fort Institutional Area, Khel Gaon Marg, New Delhi 110049")
                .latitude(new BigDecimal("28.5416"))
                .longitude(new BigDecimal("77.2098"))
                .eventDate(LocalDateTime.of(2026, 10, 18, 19, 0))
                .durationMinutes(120)
                .basePrice(new BigDecimal("999"))
                .totalSeats(350)
                .demandScore(new BigDecimal("4.7"))
                .popularityPercentile(new BigDecimal("94"))
                .bannerImageUrl("https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Zakir Khan")
                .genre("Stand-up Comedy")
                .language("Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Kenny Sebastian: The Villain Theory 2.0")
                .description("India's funniest guy is back! Kenny Sebastian's updated special covers everything from dating apps to millennial anxieties. Genuinely funny, charming, and relatable storytelling for the ages.")
                .category("COMEDY")
                .city("Bangalore")
                .venue("MLR Convention Centre")
                .venueAddress("JP Nagar, Bengaluru, Karnataka 560078")
                .latitude(new BigDecimal("12.9083"))
                .longitude(new BigDecimal("77.5839"))
                .eventDate(LocalDateTime.of(2026, 11, 22, 19, 30))
                .durationMinutes(120)
                .basePrice(new BigDecimal("799"))
                .totalSeats(300)
                .demandScore(new BigDecimal("4.5"))
                .popularityPercentile(new BigDecimal("88"))
                .bannerImageUrl("https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Kenny Sebastian")
                .genre("Stand-up Comedy")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Tanmay Bhat & Biswa Kalyan Rath: Nonsense Club Live")
                .description("Internet comedy legends Tanmay Bhat and Biswa Kalyan Rath team up for a rare live collaboration. Two of India's sharpest comedic minds dissecting pop culture, internet trends, and life's absurdities.")
                .category("COMEDY")
                .city("Mumbai")
                .venue("NESCO Pavilion, Goregaon")
                .venueAddress("Western Express Hwy, Goregaon, Mumbai, Maharashtra 400063")
                .latitude(new BigDecimal("19.1663"))
                .longitude(new BigDecimal("72.8526"))
                .eventDate(LocalDateTime.of(2026, 12, 5, 20, 0))
                .durationMinutes(150)
                .basePrice(new BigDecimal("1299"))
                .totalSeats(400)
                .demandScore(new BigDecimal("4.4"))
                .popularityPercentile(new BigDecimal("86"))
                .bannerImageUrl("https://images.unsplash.com/photo-1625046599225-28946ac2aee8?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Tanmay Bhat, Biswa Kalyan Rath")
                .genre("Stand-up Comedy")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build(),

            // ======================== THEATRE ========================
            Event.builder()
                .title("Hamilton: An American Musical - India Premiere")
                .description("The Broadway sensation Hamilton arrives in India for its historic premiere! Lin-Manuel Miranda's groundbreaking hip-hop musical about America's founding father Alexander Hamilton. A must-see theatrical experience.")
                .category("THEATRE")
                .city("Mumbai")
                .venue("NCPA - Jamshed Bhabha Theatre")
                .venueAddress("Nariman Point, Mumbai, Maharashtra 400021")
                .latitude(new BigDecimal("18.9256"))
                .longitude(new BigDecimal("72.8196"))
                .eventDate(LocalDateTime.of(2026, 10, 8, 19, 30))
                .durationMinutes(165)
                .basePrice(new BigDecimal("2000"))
                .totalSeats(250)
                .demandScore(new BigDecimal("4.8"))
                .popularityPercentile(new BigDecimal("95"))
                .bannerImageUrl("https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Musical Theatre")
                .language("English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Mughal-E-Azam: The Musical")
                .description("The legendary love story of Prince Salim and Anarkali comes alive on stage like never before. This spectacular Bollywood-inspired musical has breathtaking sets, costumes, and immersive performances.")
                .category("THEATRE")
                .city("Delhi")
                .venue("Kamani Auditorium")
                .venueAddress("1, Copernicus Marg, New Delhi 110001")
                .latitude(new BigDecimal("28.6298"))
                .longitude(new BigDecimal("77.2327"))
                .eventDate(LocalDateTime.of(2026, 11, 14, 18, 30))
                .durationMinutes(180)
                .basePrice(new BigDecimal("1500"))
                .totalSeats(200)
                .demandScore(new BigDecimal("4.3"))
                .popularityPercentile(new BigDecimal("80"))
                .bannerImageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Classical Theatre")
                .language("Hindi/Urdu")
                .createdBy(createdBy)
                .build(),

            // ======================== CONFERENCE ========================
            Event.builder()
                .title("India Tech Summit 2026: The Future Unleashed")
                .description("India's largest technology conference returns for 2026. Two days of keynotes, workshops, and networking with 200+ speakers including CTOs from Google, Microsoft, and India's top unicorns. AI, Web3, and beyond.")
                .category("CONFERENCE")
                .city("Bangalore")
                .venue("Bangalore International Exhibition Centre")
                .venueAddress("10th Mile, Tumkur Rd, Madavara, Bengaluru, Karnataka 562123")
                .latitude(new BigDecimal("13.1332"))
                .longitude(new BigDecimal("77.5214"))
                .eventDate(LocalDateTime.of(2026, 11, 28, 9, 0))
                .durationMinutes(480)
                .basePrice(new BigDecimal("4999"))
                .totalSeats(200)
                .demandScore(new BigDecimal("4.2"))
                .popularityPercentile(new BigDecimal("75"))
                .bannerImageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Technology")
                .language("English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Startup Mahakumbh 2026 - Bharat Innovation Conclave")
                .description("Asia's largest startup gathering is back! 3 days of pitches, panels, and the biggest networking event of the decade. 50,000 attendees, 2,000 startups, ₹500Cr investment pledges expected.")
                .category("CONFERENCE")
                .city("Delhi")
                .venue("Bharat Mandapam")
                .venueAddress("Pragati Maidan, New Delhi 110001")
                .latitude(new BigDecimal("28.6201"))
                .longitude(new BigDecimal("77.2405"))
                .eventDate(LocalDateTime.of(2026, 12, 10, 10, 0))
                .durationMinutes(720)
                .basePrice(new BigDecimal("2999"))
                .totalSeats(300)
                .demandScore(new BigDecimal("4.0"))
                .popularityPercentile(new BigDecimal("70"))
                .bannerImageUrl("https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Entrepreneurship/Business")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build(),

            // ======================== MOVIES/SPECIAL SCREENINGS ========================
            Event.builder()
                .title("Kalki 2898 AD - Premiere Screening with Prabhas Q&A")
                .description("Be among the first to experience the epic sci-fi fantasy Kalki 2898 AD with a special premiere screening followed by a LIVE Q&A session with Prabhas, director Nag Ashwin, and the cast.")
                .category("MOVIE")
                .city("Hyderabad")
                .venue("Prasads IMAX")
                .venueAddress("NTR Marg, Hussain Sagar, Hyderabad, Telangana 500001")
                .latitude(new BigDecimal("17.4150"))
                .longitude(new BigDecimal("78.4804"))
                .eventDate(LocalDateTime.of(2026, 10, 22, 18, 0))
                .durationMinutes(200)
                .basePrice(new BigDecimal("700"))
                .totalSeats(300)
                .demandScore(new BigDecimal("4.6"))
                .popularityPercentile(new BigDecimal("91"))
                .bannerImageUrl("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Sci-Fi/Fantasy")
                .language("Telugu/Hindi")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("Stree 3 - Special Fan Screening")
                .description("The supernatural comedy-horror phenomenon is back! Stree 3 fan screening with exclusive behind-the-scenes content, trivia competition, and merchandise giveaways. Rajkummar Rao and Shraddha Kapoor return!")
                .category("MOVIE")
                .city("Mumbai")
                .venue("Cinepolis, Andheri")
                .venueAddress("Infiniti Mall, New Link Rd, Andheri West, Mumbai 400053")
                .latitude(new BigDecimal("19.1461"))
                .longitude(new BigDecimal("72.8394"))
                .eventDate(LocalDateTime.of(2026, 11, 5, 21, 0))
                .durationMinutes(150)
                .basePrice(new BigDecimal("450"))
                .totalSeats(200)
                .demandScore(new BigDecimal("4.3"))
                .popularityPercentile(new BigDecimal("83"))
                .bannerImageUrl("https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Horror Comedy")
                .language("Hindi")
                .createdBy(createdBy)
                .build(),

            // ======================== OTHER ========================
            Event.builder()
                .title("Sunburn Festival 2026: Goa Edition")
                .description("Asia's largest electronic dance music festival returns to its iconic Goa home! 3 days, 5 stages, 100+ DJs including Martin Garrix, Armin van Buuren, and India's best EDM talent. The ultimate party experience.")
                .category("OTHER")
                .city("Goa")
                .venue("Vagator Beach Grounds")
                .venueAddress("Vagator, North Goa, Goa 403509")
                .latitude(new BigDecimal("15.6078"))
                .longitude(new BigDecimal("73.7487"))
                .eventDate(LocalDateTime.of(2026, 12, 26, 14, 0))
                .durationMinutes(720)
                .basePrice(new BigDecimal("3999"))
                .totalSeats(1000)
                .demandScore(new BigDecimal("4.7"))
                .popularityPercentile(new BigDecimal("95"))
                .bannerImageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .artistName("Martin Garrix, Armin van Buuren, Nucleya")
                .genre("Electronic/EDM")
                .language("English")
                .createdBy(createdBy)
                .build(),

            Event.builder()
                .title("NH7 Weekender Pune 2026")
                .description("India's happiest music festival is back! Multiple stages of indie, alternative, folk, jazz, and electronic music across two glorious Pune winter days. The festival that defined India's live music culture.")
                .category("OTHER")
                .city("Pune")
                .venue("Mahalaxmi Lawns")
                .venueAddress("Baner, Pune, Maharashtra 411045")
                .latitude(new BigDecimal("18.5561"))
                .longitude(new BigDecimal("73.7808"))
                .eventDate(LocalDateTime.of(2026, 11, 21, 12, 0))
                .durationMinutes(600)
                .basePrice(new BigDecimal("2499"))
                .totalSeats(800)
                .demandScore(new BigDecimal("4.5"))
                .popularityPercentile(new BigDecimal("89"))
                .bannerImageUrl("https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80")
                .status("ACTIVE")
                .externalSource("BMS")
                .genre("Multi-Genre Festival")
                .language("English/Hindi")
                .createdBy(createdBy)
                .build()
        );
    }

    private void generateSeatsForEvent(Event event) {
        List<Seat> seats = new ArrayList<>();

        // Define tier configuration based on event size
        int totalSeats = event.getTotalSeats();

        // Tier distribution: STANDARD 50%, PREMIUM 30%, VIP 15%, PRESTIGE 5%
        record TierConfig(String name, int count, double multiplier) {}
        List<TierConfig> tiers = Arrays.asList(
            new TierConfig("STANDARD", (int)(totalSeats * 0.50), 1.0),
            new TierConfig("PREMIUM",  (int)(totalSeats * 0.30), 1.5),
            new TierConfig("VIP",      (int)(totalSeats * 0.15), 2.5),
            new TierConfig("PRESTIGE", (int)(totalSeats * 0.05), 4.0)
        );

        // Rows mapping
        String[] rows = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"};

        int seatCount = 0;
        BigDecimal basePrice = event.getBasePrice();

        for (TierConfig tier : tiers) {
            int seatsInTier = tier.count();
            int cols = 10; // seats per row
            int rowsNeeded = (int) Math.ceil((double) seatsInTier / cols);

            for (int r = 0; r < rowsNeeded && seatCount < totalSeats; r++) {
                String row = rows[Math.min(r + (seatCount / (cols * rowsNeeded)), rows.length - 1)];
                // Use tier prefix for rows
                String rowLabel = tier.name().charAt(0) + String.valueOf(r + 1);

                for (int c = 1; c <= cols && seatCount < tier.count() && seatCount < totalSeats; c++) {
                    BigDecimal modifier = BigDecimal.valueOf(tier.multiplier());
                    Seat seat = Seat.builder()
                        .event(event)
                        .seatNumber(rowLabel + c)
                        .rowNumber(rowLabel)
                        .columnNumber(c)
                        .tier(tier.name())
                        .basePrice(basePrice)
                        .priceModifier(modifier)
                        .status("AVAILABLE")
                        .build();
                    seats.add(seat);
                    seatCount++;
                }
            }
        }

        seatRepository.saveAll(seats);
        log.info("Generated {} seats for event: {}", seats.size(), event.getTitle());
    }
}
