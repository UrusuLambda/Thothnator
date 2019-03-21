#!/usr/bin/env python3
import math

class Thothnator:
    def __init__(self):
        self.database = {"Spagetti":
                             {"Yellow?":
                                  [3,8],
                              "Noodle?":
                                  [1,8],
                              "Japanese Food?":
                                  [8,3],
                              "Main Dish?":
                                  [1,8],
                              "Spicy?":
                                  [6,2],
                              "Is drink?":
                                  [6,2],
                              },
                         "Sake":
                             {"Yellow?":
                                  [8,1],
                              "Noodle?":
                                  [8,1],
                              "Japanese Food?":
                                  [6,4],
                              "Main Dish?":
                                  [8,1],
                              "Spicy?":
                                  [6,3],
                              "Is drink?":
                                  [1,8],
                              },
                         "Coke":
                             {"Yellow?":
                                  [8,1],
                              "Noodle?":
                                  [8,1],
                              "Japanese Food?":
                                  [8,1],
                              "Main Dish?":
                                  [8,1],
                              "Spicy?":
                                  [8,1],
                              "Is drink?":
                                  [1,8],
                              },
                         "Hamburger":
                             {"Yellow?":
                                  [6,3],
                              "Noodle?":
                                  [8,1],
                              "Japanese Food?":
                                  [8,1],
                              "Main Dish?":
                                  [3,6],
                              "Spicy?":
                                  [8,1],
                              "Is drink?":
                                  [8,1],
                              },
                         "Pizza":
                             {"Yellow?":
                                  [7,2],
                              "Noodle?":
                                  [8,1],
                              "Japanese Food?":
                                  [8,1],
                              "Main Dish?":
                                  [1,8],
                              "Spicy?":
                                  [4,4],
                              "Is drink?":
                                  [8,1],
                              },
                         "Ramen":
                             {"Yellow?":
                                  [3,5],
                              "Noodle?":
                                  [1,8],
                              "Japanese Food?":
                                  [1,8],
                              "Main Dish?":
                                  [1,8],
                              "Spicy?":
                                  [4,4],
                              "Is drink?":
                                  [8,1],
                              },
                         "Curry":
                             {"Yellow?":
                                  [6,3],
                              "Noodle?":
                                  [8,1],
                              "Japanese Food?":
                                  [5,4],
                              "Main Dish?":
                                  [1,8],
                              "Spicy?":
                                  [1,8],
                              "Is drink?":
                                  [8,1],
                              }
                         }

        self.p = {};
        #init p
        for key in self.database.keys():
            self.p[key] = 1.0 / len(self.database.keys())
        
        self.q_list = []#[102123, 24511, 53355]]
        self.a_list = []
        self.threshold_ans = 0.5

        #init foods
        self.foods = self.database.keys()

        #init candidate
        self.q_candidates = []
        for key in self.database.keys():
            qs = self.database[key]
            for q in qs.keys():
                self.q_candidates.append(q)
        
        self.q_candidates = list(set(self.q_candidates))

    def isLastQuestion(self):
        (food, est) = self.getBestEstimate()
        if(est > self.threshold_ans):
            return True
        else:
            return False

    def calculateE(self, ps):
        entropy = 0
        for food in self.foods:
            entropy += - ps[food] * math.log2(ps[food])
        return entropy


    def calculateGainE(self, current_entropy, q):

        #first calc if a = 0
        ## calc weight for a = 0
        w_0 = 0
        ### p(food) * p(ans = 0 | food)
        for food in self.foods:
            w_0 += self.p[food] * (1.0 * self.database[food][q][0]/(self.database[food][q][0]+self.database[food][q][1]))
        
        ### calc_p after know
        p_0 = self.updateP(self.p, q, 0)
        e_0 = self.calculateE(p_0)

        #first calc if a = 1
        ## calc weight for a = 1
        w_1 = 1 - w_0

        p_1 = self.updateP(self.p, q, 1)
        e_1 = self.calculateE(p_1)

        # p(q_ans = 0) * E(q_ans=0) + p(q_ans = 1) * E(q_ans=1)
        return current_entropy - (w_0 * e_0 + w_1 * e_1)


    def showQ(self, q):
        print(" current p :  "+str(self.p))
        print (q + "? (T / t / True / true)")

    def isNeedContinueQ(self):
        if(self.isLastQuestion()):
            return False
        return True
    
    def decideQ(self):
    #search best question
        max_e = float("-inf")
        max_e_q = ""

        cur_entropy = self.calculateE(self.p)

        for q_candidate in self.q_candidates:
            if q_candidate in self.q_list:
                continue

            e = self.calculateGainE(cur_entropy, q_candidate)
            if max_e < e:
                max_e = e
                max_e_q = q_candidate

        return max_e_q

    def updateP(self, p, q, a):
        new_p = {}

        base_p = 0
        for food in self.foods:
            base_p += (self.database[food][q][a]*1.0/(self.database[food][q][0] + self.database[food][q][1])) * p[food]

        for food in self.foods:
            # p(c | qs, as, q, a) = p(a | c, q) | p(c | qs, as)
            new_p[food] = 1.0 / base_p *(self.database[food][q][a]*1.0/(self.database[food][q][0] + self.database[food][q][1])) * p[food]

        return new_p
        
    def updateDatabase(self):
        (food, est) = self.getBestEstimate()
        for q, a in zip(self.q_list, self.a_list):
            self.database[food][q][a] += 1

    def getBestEstimate(self):
        maxEstimate = 0
        maxEstimateFood = ""
        for food in self.foods:
            if maxEstimate < self.p[food]:
                maxEstimate = self.p[food]
                maxEstimateFood = food

        return (maxEstimateFood, maxEstimate)

    def showAndAskAnswer(self):
        (food, est) = self.getBestEstimate()
        print( food + " : " + str(est) + "? (T / t / True / true)")

        last_ans = self.answer()
        return last_ans

    def answer(self):
        input_text = input()
        if input_text == "T" or input_text == "t" or input_text == "true" or  input_text == "True":
            return 1
        else:
            return 0

    def main(self):
        while(self.isNeedContinueQ()):
            q = self.decideQ()
            self.showQ(q)
            self.q_list.append(q)

            a = self.answer()
            self.a_list.append(a)
            self.p = self.updateP(self.p, q, a)

        print(" result p :  "+str(self.p))
        result = self.showAndAskAnswer()
        if result == True:
            self.updateDatabase()


if __name__ == "__main__":
    
    thothnator = Thothnator()
    thothnator.main()
    
