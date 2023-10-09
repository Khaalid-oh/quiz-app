import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

//Link:https://quizapi.io/api/v1/questions
//API Key:nqmyRZgetK3MX0FCo6DUCWEIs5UWHo3SpN62AxYb
//API link:https://quizapi.io/api/v1/questions?apiKey=nqmyRZgetK3MX0FCo6DUCWEIs5UWHo3SpN62AxYb

interface QuizAttributes {
  question: string;
  answers: {
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
  };
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
  };
  id: number;
}

function Quiz() {
  const [isLoading, setIsLoading] = useState(true); 
  const [quiz, setQuiz] = useState<QuizAttributes[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<
    { question: string; isCorrect: boolean; id: number }[]
  >([]);
  const [quizStage, setQuizStage] = useState<{
    stage: number;
    selectedValue: {
      value: string;
      answer: QuizAttributes["answers"];
      id: QuizAttributes["id"];
    };
  }>({
    stage: 0,
    selectedValue: {
      answer: { answer_a: "", answer_b: "", answer_c: "", answer_d: "" },
      id: 0,
      value: "",
    },
  });

  const fetchQuiz = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<QuizAttributes[]>(
        "https://quizapi.io/api/v1/questions?apiKey=nqmyRZgetK3MX0FCo6DUCWEIs5UWHo3SpN62AxYb&limit=10"
      );

      const cleanupData: QuizAttributes[] = data?.map(
        (quiz: QuizAttributes) => {
          return {
            question: quiz.question,
            id: quiz.id,
            answers: quiz.answers,
            correct_answers: quiz.correct_answers,
          };
        }
      );

      setQuiz([...quiz, ...cleanupData]);

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  

  useEffect(() => {
    fetchQuiz();
  },[]);

  const convertObjToArray = (
    obj: QuizAttributes["answers"] | QuizAttributes["correct_answers"],
    type: "keys" | "values" | "entries" = "values"
  ) => Object[type](obj);

  const handleQuizAnswer = (answer: string, quiz: QuizAttributes) => {
    const { answers, correct_answers, id, question } = quiz;

    const answerMap = convertObjToArray(answers, "entries");

    const validatedAnswer = answerMap.find(([_, value]) => value === answer);

    const correctAnswerMap = convertObjToArray(correct_answers, "entries").find(
      ([key, value]) => key.startsWith(validatedAnswer[0])
    );

    setQuizStage((prevState) => ({
      ...prevState,
      selectedValue: {
        ...prevState.selectedValue,
        value: answer,
      },
    }));

    console.log(answer === quizStage.selectedValue.value);

    console.log(answer, quizStage.selectedValue.value);

    setQuizAnswer([
      ...quizAnswer,
      {
        id,
        isCorrect: correctAnswerMap[1] === "true" ? true : false,
        question,
      },
    ]);

    setQuizStage((prevState) => ({
      ...prevState,
      stage: prevState.stage + 1,
    }));
  };

  console.log(quizAnswer);
  return (
    <div>
      {isLoading ? (
        <Loader/>
      ) : (
        <>
          <p className="text-xl text-center font-semibold w-[90%] p-4">
            {quiz[quizStage.stage]?.question}
          </p>
          <div className="flex flex-wrap justify-around gap-8">
            {convertObjToArray(quiz[quizStage.stage].answers)
              ?.filter(Boolean)
              .map((answer, i) => (
                <div
                  className="bg-gray-300 border-black border-[1px] rounded-lg max-h-max w-96 flex items-center justify-start p-2"
                  key={i}
                >
                  <input
                    id={`check-id-${i}`}
                    type="radio"
                    name={`quiz-answer-${quizStage.stage}`}
                    className="accent-black"
                    value={answer}
                    checked={answer === quizStage.selectedValue.value}
                    onChange={() => {
                      handleQuizAnswer(answer, quiz[quizStage.stage]);
                    }}
                  />
                  <label htmlFor={`check-id-${i}`} className="px-2 text-sm">
                    {answer}
                  </label>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
