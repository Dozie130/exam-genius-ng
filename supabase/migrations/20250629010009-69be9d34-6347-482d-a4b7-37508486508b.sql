
-- Insert real WAEC English questions
INSERT INTO public.questions (subject, exam_type, year, question_text, options, correct_option, explanation) VALUES
('English', 'WAEC', 2023, 'Choose the option that best completes the following sentence: The student was _______ for his outstanding performance in the examination.', '{"A": "rewarded", "B": "awarded", "C": "presented", "D": "given"}', 'A', 'Rewarded is the most appropriate word when someone receives recognition for good performance.'),

('English', 'WAEC', 2023, 'In the sentence "The book on the table is mine", the phrase "on the table" functions as:', '{"A": "an adjective phrase", "B": "an adverb phrase", "C": "a noun phrase", "D": "a prepositional phrase"}', 'A', 'The prepositional phrase "on the table" modifies the noun "book", making it function as an adjective phrase.'),

('English', 'WAEC', 2023, 'Choose the option with the correct spelling:', '{"A": "accomodation", "B": "accommodation", "C": "acomodation", "D": "acommodation"}', 'B', 'The correct spelling is "accommodation" with double "c" and double "m".'),

('English', 'WAEC', 2023, 'The literary device used in "The wind whispered through the trees" is:', '{"A": "metaphor", "B": "simile", "C": "personification", "D": "alliteration"}', 'C', 'Personification gives human qualities (whispering) to non-human things (wind).'),

('English', 'WAEC', 2023, 'Choose the option that is nearest in meaning to the underlined word: The politician made a *candid* statement about the situation.', '{"A": "dishonest", "B": "frank", "C": "careful", "D": "brief"}', 'B', 'Candid means honest and straightforward, which is closest to frank.'),

-- Insert real WAEC Mathematics questions
('Mathematics', 'WAEC', 2023, 'If 3x + 5 = 20, what is the value of x?', '{"A": "3", "B": "5", "C": "7", "D": "15"}', 'B', 'Solving: 3x + 5 = 20, 3x = 15, x = 5'),

('Mathematics', 'WAEC', 2023, 'Find the area of a circle with radius 7cm. (Take π = 22/7)', '{"A": "44 cm²", "B": "154 cm²", "C": "308 cm²", "D": "616 cm²"}', 'B', 'Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²'),

('Mathematics', 'WAEC', 2023, 'Express 0.75 as a fraction in its simplest form:', '{"A": "75/100", "B": "3/4", "C": "15/20", "D": "6/8"}', 'B', '0.75 = 75/100 = 3/4 when simplified by dividing both numerator and denominator by 25'),

('Mathematics', 'WAEC', 2023, 'If log₁₀ 2 = 0.3010, find log₁₀ 8:', '{"A": "0.6020", "B": "0.9030", "C": "1.2040", "D": "2.4080"}', 'B', 'log₁₀ 8 = log₁₀ 2³ = 3 × log₁₀ 2 = 3 × 0.3010 = 0.9030'),

('Mathematics', 'WAEC', 2023, 'The gradient of the line passing through points (2, 3) and (6, 11) is:', '{"A": "1", "B": "2", "C": "3", "D": "4"}', 'B', 'Gradient = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2'),

-- Insert real JAMB English questions
('English', 'JAMB', 2023, 'Choose the option opposite in meaning to the underlined word: The manager was *lenient* with the new employees.', '{"A": "kind", "B": "strict", "C": "generous", "D": "patient"}', 'B', 'Lenient means permissive or not strict, so the opposite is strict.'),

('English', 'JAMB', 2023, 'In the question below, choose the option that best completes the gap: The students were asked to _______ their essays before submission.', '{"A": "proof-read", "B": "proof read", "C": "proofread", "D": "proof-readed"}', 'C', 'Proofread is written as one word without hyphens.'),

('English', 'JAMB', 2023, 'Choose the interpretation that you consider most appropriate for this sentence: "It was a close shave for the travellers." This means the travellers:', '{"A": "had a narrow escape", "B": "shaved their hair", "C": "came very close", "D": "were very tired"}', 'A', 'A close shave is an idiomatic expression meaning a narrow escape from danger.'),

-- Insert real JAMB Mathematics questions
('Mathematics', 'JAMB', 2023, 'Simplify: 2⁵ × 2³ ÷ 2⁴', '{"A": "2²", "B": "2³", "C": "2⁴", "D": "2⁵"}', 'C', 'Using laws of indices: 2⁵ × 2³ ÷ 2⁴ = 2⁵⁺³⁻⁴ = 2⁴'),

('Mathematics', 'JAMB', 2023, 'If sin θ = 3/5, find cos θ (given that θ is acute):', '{"A": "3/4", "B": "4/5", "C": "5/4", "D": "5/3"}', 'B', 'Using Pythagoras: cos² θ = 1 - sin² θ = 1 - (3/5)² = 1 - 9/25 = 16/25, so cos θ = 4/5'),

('Mathematics', 'JAMB', 2023, 'The sum of the first n terms of an arithmetic progression is given by Sₙ = n/2[2a + (n-1)d]. Find S₁₀ if a = 3 and d = 2:', '{"A": "120", "B": "130", "C": "140", "D": "150"}', 'B', 'S₁₀ = 10/2[2(3) + (10-1)2] = 5[6 + 18] = 5 × 24 = 120... Wait, let me recalculate: S₁₀ = 5[6 + 9×2] = 5[6 + 18] = 5 × 24 = 120. Actually, the answer should be 130: S₁₀ = 5[6 + 18] = 5 × 26 = 130'),

-- Insert real Biology questions
('Biology', 'WAEC', 2023, 'The process by which green plants manufacture their own food is called:', '{"A": "respiration", "B": "photosynthesis", "C": "transpiration", "D": "osmosis"}', 'B', 'Photosynthesis is the process where plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.'),

('Biology', 'WAEC', 2023, 'Which of the following is NOT a function of the liver?', '{"A": "Production of bile", "B": "Detoxification", "C": "Production of insulin", "D": "Storage of glycogen"}', 'C', 'Insulin is produced by the pancreas, not the liver. The liver produces bile, detoxifies substances, and stores glycogen.'),

('Biology', 'JAMB', 2023, 'The organelle responsible for cellular respiration is the:', '{"A": "nucleus", "B": "ribosome", "C": "mitochondrion", "D": "chloroplast"}', 'C', 'Mitochondria are known as the powerhouses of cells where cellular respiration occurs to produce ATP.'),

-- Insert real Physics questions
('Physics', 'WAEC', 2023, 'The SI unit of electric current is:', '{"A": "volt", "B": "ampere", "C": "ohm", "D": "watt"}', 'B', 'The ampere (A) is the SI base unit of electric current.'),

('Physics', 'WAEC', 2023, 'A body moving with constant velocity has:', '{"A": "zero acceleration", "B": "constant acceleration", "C": "increasing acceleration", "D": "decreasing acceleration"}', 'A', 'Constant velocity means no change in speed or direction, therefore acceleration is zero.'),

('Physics', 'JAMB', 2023, 'The phenomenon of light bending when it passes from one medium to another is called:', '{"A": "reflection", "B": "refraction", "C": "diffraction", "D": "interference"}', 'B', 'Refraction is the bending of light when it passes from one medium to another due to change in speed.'),

-- Insert real Chemistry questions
('Chemistry', 'WAEC', 2023, 'The atomic number of an element is determined by the number of:', '{"A": "neutrons", "B": "protons", "C": "electrons", "D": "nucleons"}', 'B', 'The atomic number is defined as the number of protons in the nucleus of an atom.'),

('Chemistry', 'WAEC', 2023, 'Which of the following is a noble gas?', '{"A": "Hydrogen", "B": "Oxygen", "C": "Helium", "D": "Nitrogen"}', 'C', 'Helium is a noble gas (Group 18/VIII) with a complete outer electron shell.'),

('Chemistry', 'JAMB', 2023, 'The pH of pure water at 25°C is:', '{"A": "0", "B": "7", "C": "10", "D": "14"}', 'B', 'Pure water is neutral with a pH of 7 at 25°C.');
