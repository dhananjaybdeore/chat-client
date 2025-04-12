// pages/chat.js
"use client";

import { useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "@/lib/websocketService";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import styles from "./Chat.module.css";

export default function Chat() {
  const [partnerName, setPartnerName] = useState("");
  const [messages, setMessages] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [toasts, setToasts] = useState([]);
  const router = useRouter();
  const funFacts = [
    "🐙 Octopuses have three hearts!",
    "🍯 Honey never spoils—sweet!",
    "😴 A snail can sleep for 3 years!",
    "⚔️ The shortest war lasted 38 minutes!",
    "🍌 Bananas are berries, but strawberries aren’t! 🍓",
    "🦩 A group of flamingos is a flamboyance!",
    "🐝 Honeybees can recognize human faces!",
    "🗼 The Eiffel Tower grows 15 cm in summer heat!",
    "🪐 A day on Venus is longer than its year!",
    "🦈 Sharks smell blood miles away!",
    "🐄 Cows have best friends and miss them!",
    "🦄 Scotland’s national animal is a unicorn!",
    "☁️ A cloud can weigh over a million pounds!",
    "🕷️ Meet the Hobo Spider—quite a traveler!",
    "🦘 Wombat poop is cube-shaped! 📏",
    "🌍 The longest place name has 85 letters!",
    "🦐 A shrimp’s heart is in its head!",
    "🐧 Penguins can leap 6 feet high!",
    "🦥 Sloths hold their breath longer than dolphins!",
    "⏱️ A jiffy is 1/100th of a second!",
    "🌧️ Rain smells because of bacteria spores!",
    "🐾 Cats have five toes up front, four in back!",
    "🐦 A group of crows is a murder—spooky!",
    "🖥️ The first computer bug was a real insect!",
    "✨ More stars exist than grains of sand!",
    "🦑 Octopuses blend into their surroundings!",
    "🐳 A blue whale’s tongue weighs like an elephant!",
    "🦋 Butterflies taste with their feet!",
    "🥏 The frisbee inventor became a frisbee!",
    "🐼 A group of pandas is an embarrassment!",
    "🍎 Humans share 50% DNA with bananas!",
    "🐨 Koalas have human-like fingerprints!",
    "🍝 A single spaghetti is a spaghetto!",
    "⏰ The first alarm clock rang at 4 a.m. only!",
    "🦦 Sea otters hold hands to stay together!",
    "🏜️ Antarctica is the largest desert!",
    "🦔 A group of porcupines is a prickle!",
    "🐘 Elephants can’t jump—too heavy!",
    "🐊 Crocodiles can’t stick out their tongues!",
    "🍊 Early oranges were green!",
    "🦉 A group of owls is a parliament!",
    "⚔️ A 335-year war had no deaths!",
    "🐝 Bees flap wings 200 times a second!",
    "🐱 A cat’s nose print is unique!",
    "🏯 The Great Wall isn’t visible from space!",
    "🦘 A group of kangaroos is a mob!",
    "🦇 The smallest mammal is a bumblebee bat!",
    "🐻 Polar bears have black skin!",
    "🐌 Snails can have 14,000 teeth!",
    "👅 The tongue is the strongest muscle!",
    "🪼 A group of jellyfish is a smack!",
    "🖱️ The first computer mouse was wooden!",
    "🐬 Dolphins use names for each other!",
    "🦎 A chameleon’s tongue is super long!",
    "🌙 The moon drifts 3.8 cm away yearly!",
    "🦏 A group of rhinos is a crash!",
    "🦐 The pistol shrimp is the loudest animal!",
    "🦑 Octopuses squirt ink to escape!",
    "🦩 Flamingos eat upside down!",
    "🩺 Your body has 0.2 mg of gold!",
    "🐸 A group of frogs is an army!",
    "📧 The first email was sent in 1971!",
    "🐳 A blue whale’s heart is car-sized!",
    "🪳 Cockroaches survive weeks without heads!",
    "🏔️ Mars has the tallest mountain!",
    "🦒 A group of ferrets is a business!",
    "🎮 The first video game was from 1958!",
    "🐦 A hummingbird weighs less than a penny!",
    "🦈 Sharks grow new teeth every two weeks!",
    "🌊 The ocean’s deepest point is 36,070 feet!",
    "🐒 A group of lemurs is a conspiracy!",
    "📺 The first TV remote was Lazy Bones!",
    "🦒 Giraffes have 7 neck vertebrae, like us!",
    "🦁 A lion’s roar travels 5 miles!",
    "🌌 Earth sometimes has a second moon!",
    "🦛 A group of hippos is a bloat!",
    "🖥️ The first virus was a 1982 prank!",
    "🪼 Jellyfish are 95% water!",
    "🦘 Kangaroos can’t hop backward!",
    "❄️ The largest snowflake was 15 inches!",
    "🐦 A group of ravens is an unkindness!",
    "📞 The first phone call was in 1876!",
    "🐆 Cheetahs hit 60 mph in 3 seconds!",
    "😮 A yawn lasts about 6 seconds!",
    "🌊 The Pacific shrinks 2-3 cm yearly!",
    "🐿️ A group of squirrels is a scurry!",
    "📸 The first digital camera took 23 seconds!",
    "🦅 Eagle nests can weigh 2 tons!",
    "🪰 A housefly hums in F key!",
    "🌳 The oldest tree is 4,800 years old!",
    "🐅 A group of tigers is a streak!",
    "🖥️ The first bug was an insect in a relay!",
    "🦛 Hippos open mouths 4 feet wide!",
    "⚡ Lightning is 5x hotter than the sun!",
    "🦴 The smallest bone is in your ear!",
    "🦒 A group of zebras is a dazzle!",
    "🏧 The first ATM dispensed cash in 1967!",
    "🦥 Sloths grow algae on their fur!",
    "🐱 Cats jump 5 times their height!",
    "🏔️ Mars has the largest volcano!",
    "🦢 Geese on ground are a gaggle!",
    "📼 The first VCR was piano-sized!",
    "🐳 Whales eat 8,000 lbs of krill daily!",
    "🐉 Dragonflies fly at 35 mph!",
    "👃 Your nose detects 1 trillion smells!",
    "🐺 A group of wolves is a pack!",
    "📱 The first text said 'Merry Christmas'!",
    "🐫 Camels drink 30 gallons in 13 minutes!",
    "🌟 Starfish regrow their arms!",
    "🧊 The largest iceberg was Jamaica-sized!",
    "🦌 A group of deer is a herd!",
    "💿 The first CD came in 1982!",
    "🦗 Mantises turn heads 180 degrees!",
    "🐝 Beehives stay 92°F all year!",
    "🏞️ The deepest lake is 5,300 feet!",
    "🦇 A group of bats is a colony!",
    "🎥 The first sound movie was in 1926!",
    "🐢 Turtles breathe through their butts!",
    "🦜 Woodpeckers peck 20 times a second!",
    "🌺 The largest flower smells like decay!",
    "🐊 A group of crocodiles is a bask!",
    "⌨️ The first typewriter was from 1868!",
    "🐻 Polar bear fur is transparent!",
    "🤧 Sneezes travel up to 100 mph!",
    "🏞️ The Nile is the longest river!",
    "🐒 A group of monkeys is a troop!",
    "💡 The first light bulb lasted 13.5 hours!",
    "🦈 Whale sharks have 300 rows of teeth!",
    "🕊️ Pigeons recognize themselves in mirrors!",
    "🕳️ The largest cave fits a skyscraper!",
    "🐘 A group of elephants is a parade!",
    "✈️ The first flight lasted 12 seconds!",
    "🦞 Lobster blood turns blue with oxygen!",
    "🪲 Fireflies are beetles, not flies!",
    "🎃 The heaviest pumpkin was 2,624 lbs!",
    "🦈 A group of sharks is a shiver!",
    "📻 The first radio broadcast was in 1906!",
    "🦍 Gorillas lift 10x their weight!",
    "🦎 Chameleons change color with mood!",
    "🕷️ The biggest spider has a 12-inch leg span!",
    "🦒 A group of giraffes is a tower!",
    "📸 The first photo took 8 hours!",
    "🦄 A narwhal’s tusk is a tooth!",
    "🔩 Your body has iron for a 3-inch nail!",
    "🥚 The largest dino egg was basketball-sized!",
    "🦎 A group of lizards is a lounge!",
    "🚗 The first electric car was from 1832!",
    "🦚 Peacock feathers shimmer with light!",
    "🐠 Goldfish remember for 3 months!",
    "🌨️ The largest hailstone was 1.9 lbs!",
    "🦪 A group of clams is a bed!",
    "🧊 The first fridge was from 1805!",
    "🦅 Eagles spot prey 2 miles away!",
    "🐜 A termite queen lays 30,000 eggs daily!",
    "🌡️ Venus is the hottest planet!",
    "🐜 A group of ants is a colony!",
    "🏢 The first skyscraper was from 1885!",
    "🦑 Squids have three hearts too!",
    // Repeated fact removed for uniqueness
    "🌈 Rainbows have seven colors, but no gold!",
    "🐘 Elephants never forget their herd!",
    "🌋 Volcanoes can erupt for years!",
    "🦜 Parrots mimic sounds perfectly!",
    "🪐 Saturn’s rings are mostly ice!",
    "🐢 Sea turtles return to their birth beach!",
    "🌪️ Tornadoes can spin at 300 mph!",
    "🦒 Giraffes sleep only 2 hours a day!",
    "🌺 Orchids can live for 100 years!",
    "🦈 Sharks existed before dinosaurs!",
    "🦜 A group of parrots is a pandemonium!",
    "🌍 Earth’s core is as hot as the sun!",
    "🐘 An elephant’s trunk has 40,000 muscles!",
    "🌊 Tsunamis travel at 500 mph!",
    "🦒 Giraffes are silent—no vocal cords!",
    "🌌 The Milky Way has 200 billion stars!",
    "🐢 Tortoises can live over 150 years!",
    "🌋 Lava can reach 2,200°F!",
    "🦜 Macaws bite with 500 lbs of force!",
    "🪐 Jupiter has 95 moons!",
    "🐘 Elephants can smell water miles away!",
    "🌊 The ocean covers 71% of Earth!",
    "🦒 Giraffes have purple tongues!",
    "🌌 A black hole bends light itself!",
    "🐢 Turtles can’t leave their shells!",
  ];
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const [factList, setFactList] = useState(shuffleArray([...funFacts]));

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 200 Fun Facts Array

  const [currentFact, setCurrentFact] = useState(funFacts[0]);
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    if (!userId || !userName) {
      router.push("/");
      return;
    }

    connectWebSocket(
      userId,
      userName,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setWaiting(false);
      },
      (waitingStatus, partnerName) => {
        setPartnerName(partnerName);
        setMessages([]);
        setWaiting(waitingStatus);
      },
      showToast
    );

    // Rotate fun facts every 3 seconds while waiting
    let factInterval;
    if (waiting) {
      let index = 0;
      factInterval = setInterval(() => {
        setCurrentFact(factList[index]);
        index = (index + 1) % factList.length; // Loop through shuffled list
      }, 3000);
    }

    return () => {
      disconnectWebSocket();
      clearInterval(factInterval);
    };
  }, [router, waiting]);

  return (
    <div className={styles.container}>
      {waiting ? (
        <div className={styles.waitingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.waitingText}>
            🔥 Hang tight! Finding your chat buddy...
          </p>
          <p className={styles.funFact}>{currentFact}</p>
        </div>
      ) : (
        <>
          <ChatWindow messages={messages} partnerName={partnerName} />
          <MessageInput onSend={sendMessage} />
        </>
      )}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => removeToast(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}
