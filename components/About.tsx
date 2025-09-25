import React from 'react';

const About: React.FC = () => {
  // Общий стиль для всех заголовков на этой странице
  const headingStyle = "text-3xl font-bold mb-6 text-center text-habitica-light";

  return (
    <div className="max-w-4xl mx-auto bg-habitica-dark p-6 rounded-lg shadow-xl">
      
      {/* Секция About App */}
      <div className="pb-8">
        <h1 className={headingStyle}>About Habitica Bingo</h1>
        <div className="space-y-4 text-habitica-text-secondary max-w-3xl mx-auto">
          <p>
            This is an online application to create and track bingo cards using your tasks from Habitica.
          </p>
          <p>
            All data, including your API credentials and bingo cards, is stored locally in your browser's local storage and is never sent to any external server.
          </p>
        </div>
      </div>

      <hr className="border-t-2 border-habitica-main opacity-50" />

      {/* Секция How to Play */}
      <div className="py-8">
        <h2 className={headingStyle}>How to Play</h2>
        <ol className="list-decimal list-inside space-y-2 text-habitica-text-secondary max-w-md mx-auto">
            <li>Enter your data in the Profile section.</li>
            <li>Create a bingo - just select the tasks you need from Habitica!</li>
            <li>Play bingo - update the desired bingo grid and completed tasks will be crossed out automatically! You can play several bingos at the same time.</li>
            <li>Shout BINGO and have fun!</li>
        </ol>
      </div>

      <hr className="border-t-2 border-habitica-main opacity-50" />

      {/* Секция About Developer */}
      <div className="pt-8">
        <h2 className={headingStyle}>About the developer</h2>
        <div className="space-y-4 text-habitica-text-secondary max-w-3xl mx-auto">
           <p>
              Hi! My name is <a href="https://habitica.com/profile/d5edea78-6f44-43d6-83ef-fc9da1cbcae2" target="_blank" rel="noopener noreferrer" className="text-habitica-light hover:underline">@hongweibing</a>.
          </p>
          <p>
              I am a big fan of Habitica, and I am trying to make the experience of using it even better. On <a href="https://storm-girdle-c18.notion.site/Useful-tools-for-Habitica-26486e08ea8a80f791bbd192356d3c6c" target="_blank" rel="noopener noreferrer" className="text-habitica-light hover:underline">this page</a>, I will post useful scripts, utilities, apps and other materials that may be useful to you. If you have any ready-made materials or ideas, you can write to me.
          </p>
          <p>
              You can also give me a couple of <span className="text-green-400 font-semibold">gems</span> if you find these materials useful :) But this is not necessary. The main thing is to develop yourself and achieve your goals!
          </p>
          <p>
              Good luck!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;