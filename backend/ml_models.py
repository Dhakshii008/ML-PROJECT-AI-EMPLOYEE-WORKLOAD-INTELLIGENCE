"""
Machine Learning and Data Science Core Architecture for Workload Intelligence
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression

class WorkforceMLEngine:
    def __init__(self):
        # 1. Supervised Random Forest Classifier for Risk Prediction (LOW=0, MEDIUM=1, HIGH=2)
        self.rf_classifier = RandomForestClassifier(n_estimators=50, random_state=42)
        self._train_synthetic_classifier()

        # 2. Unsupervised K-Means for Employee Clustering (4 clusters)
        self.kmeans = KMeans(n_clusters=4, random_state=42, n_init='auto')
        self._fit_kmeans_baseline()

    def _train_synthetic_classifier(self):
        # Features: [workload, overtime, deadline_count, pending_tasks, productivity]
        X = np.array([
            [87, 8.5, 5, 6, 89],  # High
            [92, 11.0, 4, 5, 88], # High
            [81, 6.0, 3, 4, 83],  # High
            [74, 3.5, 3, 3, 91],  # Medium
            [68, 2.5, 2, 3, 92],  # Medium
            [69, 2.0, 2, 3, 93],  # Medium
            [52, 0.0, 1, 2, 94],  # Low
            [61, 2.0, 2, 3, 86],  # Low
            [38, 0.0, 1, 1, 84],  # Low
            [58, 0.5, 1, 2, 85],  # Low
            [46, 0.0, 1, 1, 90],  # Low
            [64, 1.0, 2, 2, 87]   # Low
        ])
        y = np.array([2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0])
        self.rf_classifier.fit(X, y)

    def _fit_kmeans_baseline(self):
        # Fit on workload and productivity
        baseline = np.array([
            [87, 89], [92, 88], [81, 83], [74, 91], 
            [68, 92], [52, 94], [61, 86], [38, 84], [46, 90]
        ])
        self.kmeans.fit(baseline)

    def predict_risk(self, workload, overtime, deadlines, pending, productivity):
        features = np.array([[workload, overtime, deadlines, pending, productivity]])
        pred = self.rf_classifier.predict(features)[0]
        probs = self.rf_classifier.predict_proba(features)[0]
        
        labels = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}
        risk_level = labels.get(pred, 'LOW')

        # Feature importances
        return {
            'risk_level': risk_level,
            'confidence': float(np.max(probs)),
            'risk_score': float(probs[2] if len(probs) > 2 else 0.2)
        }

    def forecast_workload(self, weekly_trend, periods=4, growth_factor=1.0):
        trend = np.array(weekly_trend, dtype=float)
        X = np.arange(len(trend)).reshape(-1, 1)
        model = LinearRegression().fit(X, trend)

        future_X = np.arange(len(trend), len(trend) + periods).reshape(-1, 1)
        preds = model.predict(future_X) * growth_factor
        preds = np.clip(np.round(preds), 20, 99).tolist()

        return [
            {"week": f"Week {i+1}", "predicted_workload": int(val)}
            for i, val in enumerate(preds)
        ]

    def match_task(self, task, employees):
        req_skills = [s.lower() for s in task.get('requiredSkills', [])]
        est_hours = float(task.get('estimatedHours', 12))
        deadline_days = float(task.get('deadlineDays', 3))

        scored = []
        for emp in employees:
            emp_skills = [s.lower() for s in emp.get('skills', [])]
            matches = [s for s in req_skills if any(s in es or es in s for es in emp_skills)]
            skill_score = (len(matches) / max(len(req_skills), 1)) * 100

            capacity = emp.get('availableCapacity', 30)
            workload = emp.get('currentWorkload', 60)
            risk = emp.get('risk', 'LOW')
            productivity = emp.get('productivity', 85)

            # Daily feasibility
            daily_req = est_hours / max(deadline_days, 1)
            daily_avail = (capacity / 100.0) * 8.0
            feasibility = 95 if daily_avail >= daily_req else max(40, int((daily_avail / max(daily_req, 0.1)) * 90))

            # Composite suitability score
            score = (skill_score * 0.38) + (capacity * 0.32) + (feasibility * 0.15) + (productivity * 0.15)
            if risk == 'HIGH':
                score -= 35
            elif risk == 'MEDIUM':
                score -= 10

            task_impact = int((est_hours / 40.0) * 30)
            pred_workload = min(workload + task_impact, 99)

            scored.append({
                'employee_id': emp.get('id'),
                'name': emp.get('name'),
                'skill_match': round(skill_score, 1),
                'available_capacity': capacity,
                'current_workload': workload,
                'predicted_workload': pred_workload,
                'is_overload_risk': pred_workload >= 80 or risk == 'HIGH',
                'composite_score': max(int(round(score)), 10)
            })

        scored.sort(key=lambda x: x['composite_score'], reverse=True)
        return scored

ml_engine = WorkforceMLEngine()
