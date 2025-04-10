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
    "Did you know? Octopuses have three hearts!",
    "Fun fact: Honey never spoils!",
    "Wow! A snail can sleep for 3 years!",
    "Crazy: The shortest war in history lasted 38 minutes!",
    "Guess what? Bananas are berries, but strawberries aren’t!",
    "A group of flamingos is called a 'flamboyance.'",
    "The shortest war in history lasted 38 minutes.",
    "Honeybees can recognize human faces.",
    "The Eiffel Tower can be 15 cm taller in summer due to heat expansion.",
    "A day on Venus is longer than its year.",
    "Sharks possess an acute sense of smell, detecting blood in the water from miles away.",
    "Cows have best friends and get stressed when separated.",
    "The unicorn is Scotland’s national animal.",
    "A single cloud can weigh over a million pounds.",
    "There’s a species of spider called the Hobo Spider.",
    "Wombat poop is cube-shaped.",
    "The longest place name in the world has 85 letters!",
    "A shrimp’s heart is in its head.",
    "Penguins can jump up to 6 feet in the air.",
    "The shortest war in history lasted 38 minutes.",
    "Sloths can hold their breath longer than dolphins.",
    "A jiffy is an actual unit of time: 1/100th of a second.",
    "The smell of rain is caused by bacteria spores.",
    "Cats have five toes on their front paws but only four on the back.",
    "A group of crows is called a murder.",
    "The first computer 'bug' was an actual insect stuck in a relay.",
    "There are more stars in the universe than grains of sand on Earth.",
    "An octopus can change color to blend into its surroundings.",
    "The shortest war in history lasted 38 minutes.",
    "A blue whale’s tongue weighs as much as an elephant.",
    "Butterflies taste with their feet.",
    "The inventor of the frisbee was turned into a frisbee after he died.",
    "A group of pandas is called an embarrassment.",
    "Humans share 50% of their DNA with bananas.",
    "The shortest war in history lasted 38 minutes.",
    "Koalas have fingerprints almost identical to humans.",
    "A single strand of spaghetti is called a 'spaghetto.'",
    "The first alarm clock could only ring at 4 a.m.",
    "Sea otters hold hands while sleeping to stay together.",
    "The world’s largest desert is Antarctica, not the Sahara.",
    "A group of porcupines is called a prickle.",
    "The shortest war in history lasted 38 minutes.",
    "Elephants are the only animals that can’t jump.",
    "A crocodile can’t stick its tongue out.",
    "The first oranges weren’t orange—they were green.",
    "A group of owls is called a parliament.",
    "The longest war in history lasted 335 years with no deaths.",
    "Honeybees can flap their wings 200 times per second.",
    "The shortest war in history lasted 38 minutes.",
    "A cat’s nose print is as unique as a human fingerprint.",
    "The Great Wall of China isn’t visible from space with the naked eye.",
    "A group of kangaroos is called a mob.",
    "The world’s smallest mammal is the bumblebee bat.",
    "Polar bears have black skin under their white fur.",
    "The shortest war in history lasted 38 minutes.",
    "A snail can have up to 14,000 teeth!",
    "The strongest muscle in the human body is the tongue.",
    "A group of jellyfish is called a smack.",
    "The first computer mouse was made of wood.",
    "Dolphins call each other by name.",
    "The shortest war in history lasted 38 minutes.",
    "A chameleon’s tongue can be twice its body length.",
    "The moon is drifting away from Earth by 3.8 cm every year.",
    "A group of rhinos is called a crash.",
    "The loudest animal on Earth is the pistol shrimp.",
    "Octopuses can squirt ink to escape predators.",
    "The shortest war in history lasted 38 minutes.",
    "A flamingo can only eat with its head upside down.",
    "The human body contains about 0.2 milligrams of gold.",
    "A group of frogs is called an army.",
    "The first email was sent in 1971.",
    "A blue whale’s heart is the size of a car.",
    "The shortest war in history lasted 38 minutes.",
    "A cockroach can live for weeks without its head.",
    "The tallest mountain in our solar system is on Mars.",
    "A group of ferrets is called a business.",
    "The first video game was created in 1958.",
    "A hummingbird weighs less than a penny.",
    "The shortest war in history lasted 38 minutes.",
    "A shark can grow a new set of teeth every two weeks.",
    "The deepest part of the ocean is 36,070 feet.",
    "A group of lemurs is called a conspiracy.",
    "The first TV remote was called 'Lazy Bones.'",
    "A giraffe’s neck has the same number of vertebrae as a human’s.",
    "The shortest war in history lasted 38 minutes.",
    "A lion’s roar can be heard 5 miles away.",
    "The Earth has two moons—at least temporarily.",
    "A group of hippos is called a bloat.",
    "The first computer 'virus' was created as a prank in 1982.",
    "A jellyfish is 95% water.",
    "The shortest war in history lasted 38 minutes.",
    "A kangaroo can’t hop backward.",
    "The largest snowflake ever recorded was 15 inches wide.",
    "A group of ravens is called an unkindness.",
    "The first telephone call was made in 1876.",
    "A cheetah can run up to 60 mph in 3 seconds.",
    "The shortest war in history lasted 38 minutes.",
    "A human yawn lasts about 6 seconds on average.",
    "The Pacific Ocean is shrinking by 2-3 cm per year.",
    "A group of squirrels is called a scurry.",
    "The first digital camera took 23 seconds to take a photo.",
    "A bald eagle’s nest can weigh up to 2 tons.",
    "The shortest war in history lasted 38 minutes.",
    "A housefly hums in the key of F.",
    "The oldest known living tree is over 4,800 years old.",
    "A group of tigers is called a streak.",
    "The first computer 'bug' was an actual insect stuck in a relay.",
    "A hippopotamus can open its mouth 4 feet wide.",
    "The shortest war in history lasted 38 minutes.",
    "A bolt of lightning is 5 times hotter than the sun’s surface.",
    "The smallest bone in the human body is in the ear.",
    "A group of zebras is called a dazzle.",
    "The first ATM dispensed cash in 1967.",
    "A sloth moves so slowly that algae grows on its fur.",
    "The shortest war in history lasted 38 minutes.",
    "A cat can jump up to 5 times its height.",
    "The largest volcano in our solar system is on Mars.",
    "A group of geese on the ground is called a gaggle.",
    "The first VCR was the size of a piano.",
    "A blue whale can eat up to 8,000 lbs of krill a day.",
    "The shortest war in history lasted 38 minutes.",
    "A dragonfly can fly up to 35 mph.",
    "The human nose can detect over 1 trillion smells.",
    "A group of wolves is called a pack.",
    "The first text message said 'Merry Christmas.'",
    "A camel can drink 30 gallons of water in 13 minutes.",
    "The shortest war in history lasted 38 minutes.",
    "A starfish can regrow its arms.",
    "The largest iceberg ever recorded was bigger than Jamaica.",
    "A group of deer is called a herd.",
    "The first CD was produced in 1982.",
    "A praying mantis can turn its head 180 degrees.",
    "The shortest war in history lasted 38 minutes.",
    "A beehive can maintain a temperature of 92°F year-round.",
    "The deepest lake in the world is over 5,300 feet deep.",
    "A group of bats is called a colony.",
    "The first movie with sound premiered in 1926.",
    "A turtle can breathe through its butt.",
    "The shortest war in history lasted 38 minutes.",
    "A woodpecker can peck 20 times per second.",
    "The largest flower in the world smells like rotting flesh.",
    "A group of crocodiles is called a bask.",
    "The first typewriter was patented in 1868.",
    "A polar bear’s fur isn’t white—it’s transparent.",
    "The shortest war in history lasted 38 minutes.",
    "A human sneeze can travel up to 100 mph.",
    "The longest river in the world is the Nile.",
    "A group of monkeys is called a troop.",
    "The first light bulb lasted 13.5 hours.",
    "A whale shark has over 300 rows of teeth.",
    "The shortest war in history lasted 38 minutes.",
    "A pigeon can recognize itself in a mirror.",
    "The largest cave in the world could fit a skyscraper.",
    "A group of elephants is called a parade.",
    "The first airplane flight lasted 12 seconds.",
    "A lobster’s blood is colorless until exposed to oxygen.",
    "The shortest war in history lasted 38 minutes.",
    "A firefly isn’t a fly—it’s a beetle.",
    "The heaviest pumpkin ever grown weighed 2,624 lbs.",
    "A group of sharks is called a shiver.",
    "The first radio broadcast was in 1906.",
    "A gorilla can lift up to 10 times its body weight.",
    "The shortest war in history lasted 38 minutes.",
    "A chameleon can change color to match its mood.",
    "The largest spider in the world has a 12-inch leg span.",
    "A group of giraffes is called a tower.",
    "The first photograph took 8 hours to expose.",
    "A narwhal’s tusk is actually a tooth.",
    "The shortest war in history lasted 38 minutes.",
    "A human body has enough iron to make a 3-inch nail.",
    "The largest dinosaur egg was the size of a basketball.",
    "A group of lizards is called a lounge.",
    "The first electric car was built in 1832.",
    "A peacock’s feathers are iridescent due to light diffraction.",
    "The shortest war in history lasted 38 minutes.",
    "A goldfish has a memory span of 3 months—not 3 seconds!",
    "The largest hailstone ever recorded weighed 1.9 lbs.",
    "A group of clams is called a bed.",
    "The first refrigerator was invented in 1805.",
    "A bald eagle can spot prey from 2 miles away.",
    "The shortest war in history lasted 38 minutes!",
    "A termite queen can lay 30,000 eggs in a day.",
    "The hottest planet in our solar system is Venus.",
    "A group of ants is called a colony.",
    "The first skyscraper was built in 1885.",
    "A squid has three hearts and can change color!",
    "The shortest war in history lasted 38 minutes!",
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
