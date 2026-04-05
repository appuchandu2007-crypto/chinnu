import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  Phone,
  Shield,
  Heart,
  Star,
  Send,
  User,
  CheckCircle2,
  MessageSquare,
  X,
  Activity,
  Search,
  FileText,
} from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Toaster, toast } from "sonner";
import { format } from "date-fns";

const WhatsAppIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const QUOTES = [
  "Miracle happens when you replace tears with prayers and fear with faith",
  "They say teachers are like god, but be strong and believe in yourself",
  "Success is not just achievement, it is loving what you do",
  "You are stronger than you think",
  "Every storm passes",
  "Your feelings are valid",
  "You matter",
  "Stay strong",
  "Keep going",
  "You are not alone",
  "Believe in yourself",
  "Healing takes time",
  "Small steps matter",
  "Your story matters",
  "You are enough",
  "Choose hope",
  "Keep faith",
  "Stay positive",
  "You can overcome anything",
  "Be kind to yourself",
  "Growth takes time",
  "Never give up",
  "Better days are coming",
  "You are brave",
  "Trust the process",
  "Stay calm",
  "Smile more",
  "Be proud of yourself",
  "You deserve happiness",
  "Light will come",
];

const INITIAL_REVIEWS = [
  {
    id: "static-1",
    name: "Satish",
    role: "Engineer",
    text: "This platform made me feel heard.",
    rating: 5,
    likes: 12,
    date: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "static-2",
    name: "Nagarathna",
    role: "Teacher",
    text: "Very supportive and kind.",
    rating: 5,
    likes: 8,
    date: new Date(Date.now() - 86400000 * 12),
  },
  {
    id: "static-3",
    name: "Chandan",
    role: "Developer",
    text: "Helped me during tough times.",
    rating: 4,
    likes: 15,
    date: new Date(Date.now() - 86400000 * 18),
  },
  {
    id: "static-4",
    name: "Lakshmi Devi",
    role: "HOD",
    text: "A meaningful initiative for students.",
    rating: 5,
    likes: 20,
    date: new Date(Date.now() - 86400000 * 22),
  },
  {
    id: "static-5",
    name: "Vandana",
    role: "Graduate",
    text: "Gave me emotional strength.",
    rating: 5,
    likes: 10,
    date: new Date(Date.now() - 86400000 * 25),
  },
  {
    id: "static-6",
    name: "Vamshi",
    role: "MLA",
    text: "Important platform for society.",
    rating: 5,
    likes: 35,
    date: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: "static-7",
    name: "Pallavi",
    role: "Student",
    text: "Felt safe and understood.",
    rating: 4,
    likes: 6,
    date: new Date(Date.now() - 86400000 * 35),
  },
  {
    id: "static-8",
    name: "Harish",
    role: "Designer",
    text: "Amazing support system.",
    rating: 5,
    likes: 18,
    date: new Date(Date.now() - 86400000 * 40),
  },
  {
    id: "static-9",
    name: "Swamy",
    role: "HR",
    text: "Very comforting experience.",
    rating: 5,
    likes: 9,
    date: new Date(Date.now() - 86400000 * 42),
  },
  {
    id: "static-10",
    name: "Ganganna",
    role: "Entrepreneur",
    text: "Highly recommended.",
    rating: 5,
    likes: 22,
    date: new Date(Date.now() - 86400000 * 45),
  },
  {
    id: "static-11",
    name: "Chethan",
    role: "Student",
    text: "It really helped me calm down.",
    rating: 4,
    likes: 14,
    date: new Date(Date.now() - 86400000 * 50),
  },
  {
    id: "static-12",
    name: "Mamtha",
    role: "Professional",
    text: "A truly safe space to talk.",
    rating: 5,
    likes: 27,
    date: new Date(Date.now() - 86400000 * 55),
  },
  {
    id: "static-13",
    name: "Pushpa",
    role: "Homemaker",
    text: "I feel much better after using this.",
    rating: 5,
    likes: 31,
    date: new Date(Date.now() - 86400000 * 60),
  },
  {
    id: "static-14",
    name: "Sahana",
    role: "Graduate",
    text: "Thank you for listening to me.",
    rating: 5,
    likes: 11,
    date: new Date(Date.now() - 86400000 * 65),
  },
  {
    id: "static-15",
    name: "Suvarnamma",
    role: "Teacher",
    text: "A wonderful and caring platform.",
    rating: 5,
    likes: 19,
    date: new Date(Date.now() - 86400000 * 70),
  },
];

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c < 100) return c + 1;
        clearInterval(interval);
        return c;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-4xl md:text-5xl font-extrabold text-pink-600 drop-shadow-sm">
        {count}+ Users Supported
      </h2>
    </div>
  );
};

const MoodAnalytics = () => {
  return (
    <div className="mt-16 max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
        <Activity className="text-pink-500" /> Mood Analytics
      </h3>
      <p className="text-gray-600 text-center mb-6">
        We analyze user emotions for better support
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-100 text-center">
          <span className="text-2xl block mb-1">😊</span>
          <span className="font-bold text-yellow-700">124 Happy</span>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-xl border border-blue-100 text-center">
          <span className="text-2xl block mb-1">😔</span>
          <span className="font-bold text-blue-700">85 Sad</span>
        </div>
        <div className="bg-red-50 px-6 py-3 rounded-xl border border-red-100 text-center">
          <span className="text-2xl block mb-1">😡</span>
          <span className="font-bold text-red-700">42 Angry</span>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ text: string; isBot: boolean; hasWhatsAppLink?: boolean }>([
    { text: "Hi! How can I help you today?", isBot: true },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newChat = [...chat, { text: msg, isBot: false }];
    setChat(newChat);
    setMsg("");

    setTimeout(() => {
      let reply = "I’m here for you 💙";
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("sad"))
        reply = "I understand you're feeling sad 😔 You’re not alone 💙";
      else if (lowerMsg.includes("angry"))
        reply = "Take a deep breath 😡 We’ll figure it out together 💙";
      else if (lowerMsg.includes("fear") || lowerMsg.includes("scared"))
        reply = "You are safe here. It's okay to feel scared 💙";
      else if (lowerMsg.includes("confused"))
        reply = "It's okay to feel confused. We can figure it out together 💙";

      setChat((prev) => [...prev, { text: reply, isBot: true, hasWhatsAppLink: true }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-105"
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
          >
            <div className="bg-pink-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Heart size={18} /> VV Support Bot
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-pink-700 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4 bg-white flex flex-col gap-3">
              {chat.map((c, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] p-3 rounded-2xl ${c.isBot ? "bg-white text-gray-800 self-start border border-gray-200 rounded-tl-none" : "bg-pink-500 text-white self-end rounded-tr-none"}`}
                >
                  <p>{c.text}</p>
                  {c.hasWhatsAppLink && (
                    <a
                      href="https://wa.me/917411837814?text=Hello%20VV%20Solutions%20I%20need%20support"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      <WhatsAppIcon size={14} /> Chat on WhatsApp
                    </a>
                  )}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const QuoteCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-transparent py-4 text-center overflow-hidden relative h-16 flex items-center justify-center border-y border-pink-100/50">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-pink-800 font-medium px-4 italic"
        >
          "{QUOTES[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const EmotionTracker = () => {
  const [response, setResponse] = useState("");
  const [activeMood, setActiveMood] = useState("");

  const handleMood = (mood: string) => {
    setActiveMood(mood);
    if (mood === "sad") {
      setResponse(
        "I’m really sorry you’re feeling this way 😔 It’s okay to feel sad sometimes. You can talk to us freely 💙 We are here for you.",
      );
    } else if (mood === "angry") {
      setResponse(
        "I understand you’re feeling angry 😡 Take a deep breath… you’re not alone. Let’s talk and find a way to feel better 💙",
      );
    } else if (mood === "confused") {
      setResponse(
        "It’s okay to feel confused 😕 Life can be overwhelming sometimes. We are here to help you think clearly 💙",
      );
    } else if (mood === "fear") {
      setResponse(
        "You’re safe here 💙 It’s okay to feel fear sometimes. Let’s talk, we’ll get through this together 🤝",
      );
    } else if (mood === "shock") {
      setResponse(
        "Take a moment to process what happened 😲 We are here to support you through this surprise. Breathe 💙",
      );
    } else {
      setResponse(
        "That’s amazing 😊✨ We’re happy to see you happy! Keep smiling and spreading positivity 💙",
      );
    }
  };

  const emotions = [
    {
      id: "happy",
      label: "Happy",
      image:
        "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=200&h=200&q=80",
      color:
        "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      id: "sad",
      label: "Sad",
      image:
        "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=200&h=200&q=80",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "angry",
      label: "Angry",
      image:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?auto=format&fit=crop&w=200&h=200&q=80",
      color: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
    },
    {
      id: "confused",
      label: "Confused",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
      color:
        "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: "fear",
      label: "Fear",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80",
      color: "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200",
    },
    {
      id: "shock",
      label: "Shock",
      image:
        "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=200&h=200&q=80",
      color:
        "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          How are you feeling today?
        </h2>
        <p className="text-gray-700">
          Select an emotion below. We are here to listen.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
        {emotions.map((emo) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={emo.id}
            onClick={() => handleMood(emo.id)}
            className={`flex flex-col items-center justify-center w-36 h-44 md:w-44 md:h-52 rounded-2xl border-2 transition-all overflow-hidden ${emo.color} ${activeMood === emo.id ? "ring-4 ring-offset-2 ring-opacity-50 ring-pink-400" : ""}`}
          >
            <img
              src={emo.image}
              alt={emo.label}
              className="w-24 h-24 md:w-[120px] md:h-[120px] object-cover object-top rounded-full mb-3 shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="font-medium text-lg">{emo.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            key={response}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 text-center max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
              {response}
            </p>
            <div className="mt-6">
              <a
                href="https://wa.me/917411837814?text=Hello%20VV%20Solutions%20I%20need%20support"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                <WhatsAppIcon size={20} />
                Chat with us now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MoodAnalytics />
    </div>
  );
};

const ReviewSection = () => {
  const [dbReviews, setDbReviews] = useState<
    {
      id: string;
      name: string;
      role: string;
      text: string;
      rating: number;
      likes: number;
      date: Date;
    }[]
  >([]);
  const [newReview, setNewReview] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Anonymous",
            role: data.role || "User",
            text: data.text || "",
            rating: data.rating || 5,
            likes: data.likes || 0,
            date: data.createdAt?.toDate() || new Date(),
          };
        });
        setDbReviews(fetchedReviews);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: newName.trim() || "Anonymous",
        role: newRole.trim() || "User",
        text: newReview.trim(),
        rating: rating,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setNewReview("");
      setNewName("");
      setNewRole("");
      setRating(5);
      toast.success("We're here for you 💙");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (id.startsWith("static-")) return; // Can't like static reviews easily without DB migration, so we skip or handle locally.
    try {
      await updateDoc(doc(db, "reviews", id), {
        likes: increment(1),
      });
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const allReviews = [...INITIAL_REVIEWS, ...dbReviews];
  const filteredReviews = allReviews.filter(
    (r) =>
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const avgRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
          allReviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="bg-transparent py-16 px-4 border-y border-pink-100/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What People Say
          </h2>
          <p className="text-gray-600 mb-2">
            Real stories from people who found a safe space with us.
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold text-xl mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={
                    i < Math.round(parseFloat(avgRating))
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    i < Math.round(parseFloat(avgRating)) ? "" : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span>({avgRating}/5)</span>
          </div>

          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={review.id || idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          i < (review.rating || 5) ? "currentColor" : "none"
                        }
                        className={
                          i < (review.rating || 5) ? "" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {format(review.date, "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 italic flex-1">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.name}
                      </p>
                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(review.id as string)}
                    className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={
                        review.likes && review.likes > 0
                          ? "fill-pink-500 text-pink-500"
                          : ""
                      }
                    />
                    <span className="text-sm font-medium">
                      {review.likes || 0}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No reviews found matching"{searchQuery}"
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Your Review
          </h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      fill={
                        (hoverRating || rating) >= star ? "#eab308" : "none"
                      }
                      className={
                        (hoverRating || rating) >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Role (Optional)
              </label>
              <input
                id="role"
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g., Student, Professional, Parent"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Experience or Feedback
              </label>
              <textarea
                id="review"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience or feedback with us..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommunityQuotes = () => {
  const [quotes, setQuotes] = useState<
    { id: string; name: string; quote: string; date: Date }[]
  >([]);
  const [newQuote, setNewQuote] = useState("");
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setQuotes(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Anonymous",
            quote: doc.data().quote || "",
            date: doc.data().createdAt?.toDate() || new Date(),
          })),
        );
      },
      (error) => {
        console.error("Error fetching quotes:", error);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "quotes"), {
        name: newName.trim() || "Anonymous",
        quote: newQuote.trim(),
        createdAt: serverTimestamp(),
      });
      setNewQuote("");
      setNewName("");
      toast.success("Stay strong 💙");
    } catch (error) {
      console.error("Error adding quote:", error);
      toast.error("Failed to share thought. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent py-16 px-4 border-t border-pink-100/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🌍 Community Thoughts
          </h2>
          <p className="text-gray-600">
            Read what others are sharing and add your own thought.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {quotes.map((q) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={q.id}
              className="bg-pink-50 p-6 rounded-2xl border border-pink-100 relative"
            >
              <p className="text-gray-800 text-lg italic mb-4">💬"{q.quote}"</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  {format(q.date, "MMM d, yyyy")}
                </span>
                <p className="text-pink-600 font-semibold">— {q.name}</p>
              </div>
            </motion.div>
          ))}
          {quotes.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No thoughts shared yet. Be the first!
            </div>
          )}
        </div>

        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ✨ Share Your Thought
          </h3>
          <form onSubmit={handleAddQuote} className="space-y-4">
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <textarea
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Write your quote..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? "Sharing..." : "Share"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const TermsPrivacyModal = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-gray-200"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-pink-500" />
            {type === "terms" ? "Terms of Use" : "Privacy Policy"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose max-w-none text-gray-600">
          <p className="text-lg font-medium mb-6">
            At VV Solutions, your privacy and trust are our top priorities.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            1. Information We Collect
          </h3>
          <p>We may collect basic user information such as:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Name</li>
            <li>Age</li>
            <li>Contact Number</li>
            <li>Messages shared on the platform</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            2. How We Use Your Information
          </h3>
          <p>The collected data is used only to:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Provide better emotional support</li>
            <li>Improve user experience</li>
            <li>Understand user needs and emotions</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            3. Data Protection
          </h3>
          <p>
            We ensure that all user information is handled securely. We do not
            share, sell, or misuse your personal data.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            4. Confidentiality
          </h3>
          <p>
            Your conversations are treated with respect and confidentiality. Our
            goal is to provide a safe and non-judgmental environment.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            5. No Third-Party Sharing
          </h3>
          <p>
            We do not share your personal data with third parties without your
            consent, except where required by law.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            6. User Control
          </h3>
          <p>Users have the right to:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Choose what information to share</li>
            <li>Stop using the platform at any time</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
            7. Emergency Situations
          </h3>
          <p>
            If a user expresses serious distress, we may guide them toward
            official helpline services for professional support.
          </p>

          <hr className="my-6 border-gray-200" />

          <p className="font-bold text-pink-600">
            By using VV Solutions, you trust us with your information, and we
            are committed to protecting it responsibly.
          </p>
        </div>
        <div className="p-6 border-t border-gray-100 bg-white text-right">
          <button
            onClick={onClose}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-[9999]">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-2xl md:text-3xl font-bold tracking-wider"
        >
          Loading VV Solutions...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-white font-sans text-gray-900 selection:bg-pink-200 selection:text-pink-900 transition-colors duration-300">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{ className: " " }}
      />

      <QuoteCarousel />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24 pb-24 px-4 transition-colors duration-300 border-b border-pink-100">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 drop-shadow-sm">
              VV Solutions
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-8">
              You don’t have to go through it alone
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="bg-white px-4 py-2 rounded-full text-gray-800 text-sm md:text-base font-medium border border-gray-200 flex items-center gap-2">
                <MessageCircle size={18} /> Available in: English, Hindi,
                Kannada, Telugu & Tamil
              </span>
            </div>

            <Counter />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/917411837814?text=Hello%20VV%20Solutions%20I%20need%20support"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <WhatsAppIcon size={24} />
                Chat on WhatsApp
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <Phone size={24} />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </header>

      <EmotionTracker />

      {/* Services & Promise Section */}
      <section className="py-20 px-4 bg-transparent text-gray-900 border-y border-pink-100/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Promise</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We are here to make sure you never feel alone in your hardest
              moments. We don’t just distract you from your pain—we help you
              face it, understand it, and grow beyond it.
            </p>

            <h3 className="text-2xl font-bold mb-6">🌿 Why Choose Us?</h3>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                People handle emotions in many ways—walking alone, listening to
                music, writing diaries, or distracting themselves with
                activities. These methods may help for a moment, but they don’t
                always solve what’s truly inside.
              </p>
              <p>
                You might feel better for a while, but the pain often
                returns—because it was never truly understood or expressed.
                Distractions can comfort you temporarily, but they don’t heal
                what’s inside.
              </p>
              <p>
                Real change begins when you talk to someone. When you open up,
                share your feelings, and receive genuine support, motivation,
                and guidance—that’s when true healing starts. Conversations give
                you clarity, strength, and the courage to face even the toughest
                moments in life.
              </p>
              <p>That’s exactly why this platform exists.</p>
              <p>
                Here, you are never alone. You’ll find people who listen,
                understand, and support you without judgment. This is more than
                just a space—it’s a safe place to express yourself, connect with
                others, and grow stronger every day.
              </p>
              <p>
                Choose this platform not just for comfort, but for real change.
                Because the right conversation at the right time can truly
                change everything.
              </p>
              <p className="font-semibold text-gray-900 mt-2">
                We promise—this will be one of the most meaningful experiences
                you’ll ever have.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Shield className="text-pink-500" />
              Our Services
            </h2>
            <ul className="space-y-6">
              {[
                "🤝 Real Conversations – Talk to someone who genuinely listens",
                "💬 No Judgement Zone – Express freely without fear",
                "🗣️ Multilingual Support – Available in Kannada, Telugu, Tamil, Hindi & English",
                "🌱 Emotional Support – Get motivated and guided",
                "🔐 Safe Space one-one – Your feelings matter here",
                "100% safe and confidential",
              ].map((service, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-pink-400 shrink-0 mt-1 hidden"
                    size={20}
                  />
                  <span className="text-lg text-gray-800">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-transparent text-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            How We Started
          </h2>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed text-left md:text-center">
            <p>
              There was a time when I often felt completely alone. On my hardest
              days, when I was sad or mentally exhausted, there was no one
              around to truly listen or understand me. I would keep all my
              emotions inside—stress, overthinking, pain—until one day it would
              all burst out, affecting both my mind and heart. Those moments
              made me realize how important it is to simply have someone who
              cares.
            </p>
            <p className="mt-4">
              Instead of waiting for someone to come into my life, I asked
              myself a simple question: “Why don’t I become that person for
              others?” That thought changed everything. I decided that if I
              could be there for someone else—listen to them, support them, and
              motivate them—maybe I could turn my pain into something
              meaningful.
            </p>
            <p className="mt-4">
              Helping others feel heard and valued started making me feel
              stronger and happier. I shared this idea with my friend, and
              without hesitation, she said, “Let’s do it.” That’s how this
              journey began—two people with one goal: to make sure no one ever
              feels alone when they need someone the most.
            </p>
          </div>
        </div>
      </section>

      <ReviewSection />
      <CommunityQuotes />

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 bg-transparent text-gray-900 text-center border-y border-pink-100/50"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            We are here for you. Reach out today.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl flex items-center justify-center gap-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                <Phone size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Call us</p>
                <p className="text-xl font-semibold text-gray-900">
                  7411837814
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex items-center justify-center gap-4 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                <Phone size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Call us</p>
                <p className="text-xl font-semibold text-gray-900">
                  8073801532
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/917411837814?text=Hello%20VV%20Solutions%20I%20need%20support"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all"
          >
            <WhatsAppIcon size={24} />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <QuoteCarousel />

      {/* Emergency Section */}
      <section id="emergency" className="py-12 px-4 bg-transparent">
        <div className="max-w-3xl mx-auto bg-red-50 p-8 rounded-3xl text-center shadow-lg border border-red-100">
          <h2 className="text-3xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
            <span className="text-4xl">🚨</span> Need Immediate Help?
          </h2>
          <p className="text-red-800 text-lg mb-8">
            If you are feeling overwhelmed or in serious emotional distress,
            please don’t stay alone. Reach out to professional support
            immediately.
          </p>

          <div className="bg-white rounded-2xl p-6 inline-block text-left shadow-sm border border-red-100">
            <p className="text-lg text-gray-800 mb-3 flex items-center gap-3">
              <Phone className="text-red-500" size={20} />
              <span>
                Kiran Mental Health Helpline:{" "}
                <a
                  href="tel:1800-599-0019"
                  className="text-red-600 font-bold hover:underline"
                >
                  1800-599-0019
                </a>
              </span>
            </p>
            <p className="text-lg text-gray-800 flex items-center gap-3">
              <Phone className="text-red-500" size={20} />
              <span>
                AASRA Support:{" "}
                <a
                  href="tel:9820466726"
                  className="text-red-600 font-bold hover:underline"
                >
                  9820466726
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-transparent text-gray-600 py-12 px-4 text-center text-sm border-t border-pink-100/50">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4 text-base text-gray-800">
            &copy; {new Date().getFullYear()} VV Solutions (Valuable Voices).
            All rights reserved.
          </p>
          <p className="mb-6 text-pink-600 font-medium flex items-center justify-center gap-2">
            <Shield size={16} /> Your data is 100% safe and confidential
          </p>

          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setModalType("privacy")}
              className="hover:text-pink-400 transition-colors underline underline-offset-4"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType("terms")}
              className="hover:text-pink-400 transition-colors underline underline-offset-4"
            >
              Terms of Use
            </button>
          </div>

          <p className="text-xs text-gray-500 max-w-2xl mx-auto mt-4">
            Disclaimer: This platform provides emotional support and is not a
            substitute for medical help. If you are experiencing a medical
            emergency, please contact your local emergency services immediately.
          </p>
        </div>
      </footer>

      {/* Floating Emergency Button */}
      <a
        href="#emergency"
        className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 z-40 transition-transform hover:scale-105 border-2 border-white"
      >
        <span className="text-xl">🚨</span> Help
      </a>

      <Chatbot />

      <AnimatePresence>
        {modalType && (
          <TermsPrivacyModal
            isOpen={!!modalType}
            onClose={() => setModalType(null)}
            type={modalType}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
